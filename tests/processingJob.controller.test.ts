import request from "supertest";
import app from "../src/app";
import { ProcessingJob } from "../src/models/ProcessingJob";
import mongoose from "mongoose";

describe("ProcessingJob controller & routes", () => {
  beforeEach(async () => {
    await ProcessingJob.deleteMany({});
  });

  it("creates a processing job (happy path)", async () => {
    const assetId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .post("/api/processing-jobs")
      .send({
        asset_id: assetId,
        job_type: "transcoding",
        status: "pending"
      });

    expect(res.status).toBe(201);
    expect(res.body.asset_id).toBe(assetId.toString());
    expect(res.body.job_type).toBe("transcoding");
  });

  it("rejects invalid asset_id", async () => {
    const res = await request(app)
      .post("/api/processing-jobs")
      .send({ asset_id: "bad" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid/i);
  });

  it("gets a processing job by id", async () => {
    const job = await ProcessingJob.create({
      asset_id: new mongoose.Types.ObjectId(),
      job_type: "analysis",
      status: "running"
    });

    const res = await request(app).get(`/api/processing-jobs/${job._id}`);
    expect(res.status).toBe(200);
    expect(res.body.job_type).toBe("analysis");
  });

  it("returns 404 if processing job not found", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/processing-jobs/${fakeId}`);
    expect(res.status).toBe(404);
  });

  it("updates a processing job", async () => {
    const job = await ProcessingJob.create({
      asset_id: new mongoose.Types.ObjectId(),
      job_type: "filtering",
      status: "pending"
    });

    const res = await request(app)
      .put(`/api/processing-jobs/${job._id}`)
      .send({ status: "completed" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("completed");
  });

  it("returns 404 when updating missing job", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/api/processing-jobs/${fakeId}`)
      .send({ status: "completed" });

    expect(res.status).toBe(404);
  });

  it("deletes a processing job", async () => {
    const job = await ProcessingJob.create({
      asset_id: new mongoose.Types.ObjectId(),
      job_type: "compression"
    });

    const res = await request(app).delete(`/api/processing-jobs/${job._id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);

    const check = await ProcessingJob.findById(job._id);
    expect(check).toBeNull();
  });

  it("returns 404 deleting non-existent job", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/processing-jobs/${fakeId}`);
    expect(res.status).toBe(404);
  });
});
