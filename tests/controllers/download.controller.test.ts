import request from "supertest";
import app from "../../src/app";
import { Download } from "../../src/models/Download";
import mongoose from "mongoose";

describe("Download controller & routes", () => {
  beforeEach(async () => {
    await Download.deleteMany({});
  });

  it("creates a download (happy path)", async () => {
    const assetId = new mongoose.Types.ObjectId();
    const userId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .post("/api/downloads")
      .send({ asset_id: assetId, user_id: userId });

    expect(res.status).toBe(201);
    expect(res.body.asset_id).toBe(assetId.toString());
    expect(res.body.user_id).toBe(userId.toString());
  });

  it("rejects invalid asset_id or user_id", async () => {
    const res = await request(app)
      .post("/api/downloads")
      .send({ asset_id: "bad", user_id: "bad" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/failed/i);
  });

  it("gets download by id", async () => {
    const record = await Download.create({
      asset_id: new mongoose.Types.ObjectId(),
      user_id: new mongoose.Types.ObjectId()
    });

    const res = await request(app).get(`/api/downloads/${record._id}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe((record._id as mongoose.Types.ObjectId).toString());
  });

  it("returns 404 if download not found", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/downloads/${fakeId}`);
    expect(res.status).toBe(404);
  });

  it("updates a download", async () => {
    const record = await Download.create({
      asset_id: new mongoose.Types.ObjectId(),
      user_id: new mongoose.Types.ObjectId()
    });

    const newUserId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/api/downloads/${record._id}`)
      .send({ user_id: newUserId });

    expect(res.status).toBe(200);
    expect(res.body.user_id).toBe(newUserId.toString());
  });

  it("returns 404 when updating missing download", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).put(`/api/downloads/${fakeId}`).send({ user_id: new mongoose.Types.ObjectId() });
    expect(res.status).toBe(404);
  });

  it("deletes a download", async () => {
    const record = await Download.create({
      asset_id: new mongoose.Types.ObjectId(),
      user_id: new mongoose.Types.ObjectId()
    });

    const res = await request(app).delete(`/api/downloads/${record._id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);

    const check = await Download.findById(record._id);
    expect(check).toBeNull();
  });

  it("returns 404 deleting non-existent download", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/downloads/${fakeId}`);
    expect(res.status).toBe(404);
  });
});
