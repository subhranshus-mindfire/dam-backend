import { Request, Response } from "express";
import { minioClient } from "../config/minio.connection";
import { processingQueue } from "../queues/processing.queue";
import { v4 as uuidv4 } from "uuid";
import { UploadedFile } from "../types/upload.types";
import { Readable } from "stream";
import Busboy from "busboy";


const BUCKET_NAME = "dam-bucket";

export const handleFileUpload = (
  busboy: Busboy.Busboy,
  req: Request,
  res: Response
) => {
  const uploadedFiles: UploadedFile[] = [];
  const uploads: Promise<void>[] = [];

  busboy.on("file", (fieldname: any, file: string | Readable | Buffer<ArrayBufferLike>, fileInfo: { filename: any; mimeType: any; }) => {
    const { filename, mimeType } = fileInfo;
    const objectName = `${uuidv4()}-${filename}`;

    const uploadPromise = minioClient
      .putObject(BUCKET_NAME, objectName, file)
      .then(async () => {
        console.log(`Uploaded ${filename} to MinIO as ${objectName}`);

        const job = await processingQueue.add("processFile", {
          key: objectName,
          filename,
          bucket: BUCKET_NAME,
          mimetype: mimeType,
        });

        console.log(`Job added to queue: ${job.id}`);
        uploadedFiles.push({ key: objectName, jobId: job.id as string });
      })
      .catch((err) => {
        console.error(`Error uploading ${filename}:`, err);
      });

    uploads.push(uploadPromise);
  });

  busboy.on("finish", async () => {
    try {
      await Promise.all(uploads);
      return res.status(200).json({
        message: "Upload and queueing complete",
        files: uploadedFiles,
      });
    } catch (err) {
      console.error("Error during file uploads or queueing:", err);
      return res.status(500).json({ error: "Upload failed" });
    }
  });
};
