import { Worker } from "bullmq";
import { redisConnection } from "../config/redis";
import { minioClient } from "../config/minio";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import util from "util";

const execAsync = util.promisify(exec);
const DATA_DIR = "/app/data";

export const videoWorker = new Worker(
  "processingQueue",
  async (job) => {
    const { filename, key, bucket } = job.data;

    const inputPath = path.join(DATA_DIR, filename);
    const baseName = path.basename(filename, path.extname(filename));

    const thumbPath = `${DATA_DIR}/${baseName}_thumb.jpg`;
    const out720Path = `${DATA_DIR}/${baseName}_720p.mp4`;
    const out1080Path = `${DATA_DIR}/${baseName}_1080p.mp4`;

    console.log(`[${new Date().toISOString()}] [${job.id}] Start processing ${filename}`);

    try {
      await minioClient.fGetObject(bucket, key, inputPath);
      console.log(`[${new Date().toISOString()}] [${job.id}] Downloaded from MinIO`);

      await execAsync(`ffmpeg -i "${inputPath}" -ss 00:00:01 -vframes 1 -vf scale=300:-1 "${thumbPath}"`);
      console.log(`[${new Date().toISOString()}] [${job.id}] Thumbnail generated`);

      await execAsync(`ffmpeg -i "${inputPath}" -vf scale=1280:720 "${out720Path}"`);
      console.log(`[${new Date().toISOString()}] [${job.id}] 720p conversion complete`);

      await execAsync(`ffmpeg -i "${inputPath}" -vf scale=1920:1080 "${out1080Path}"`);
      console.log(`[${new Date().toISOString()}] [${job.id}] 1080p conversion complete`);

      await minioClient.fPutObject(bucket, `${key}_thumb.jpg`, thumbPath);
      await minioClient.fPutObject(bucket, `${key}_720p.mp4`, out720Path);
      await minioClient.fPutObject(bucket, `${key}_1080p.mp4`, out1080Path);
      console.log(`[${new Date().toISOString()}] [${job.id}] Uploads to MinIO done`);

      fs.unlinkSync(inputPath);
      fs.unlinkSync(thumbPath);
      fs.unlinkSync(out720Path);
      fs.unlinkSync(out1080Path);
      console.log(`[${new Date().toISOString()}] [${job.id}] Temporary files cleaned up`);

      console.log(`[${new Date().toISOString()}] [${job.id}] Processing complete`);
    } catch (err) {
      console.error(`[${new Date().toISOString()}] [${job.id}] Processing error:`, err);
    }
  },
  {
    connection: redisConnection,
  }
);
