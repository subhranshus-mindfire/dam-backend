import request from 'supertest';
import app from '../src/app';
import { Analytics } from '../src/models/Analytics';
import mongoose from 'mongoose';

describe('Analytics controller & routes', () => {
  beforeEach(async () => {
    await Analytics.deleteMany({});
  });

  it('creates analytics (happy path)', async () => {
    const assetId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .post('/api/analytics')
      .send({ asset_id: assetId });

    expect(res.status).toBe(201);
    expect(res.body._id).toBeDefined();
    expect(res.body.asset_id).toBe(assetId.toString());
    expect(res.body.view_count).toBe(0);
  });

  it('rejects invalid asset_id', async () => {
    const res = await request(app)
      .post('/api/analytics')
      .send({ asset_id: 'invalid' });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid/i);
  });

  it('gets analytics by id', async () => {
    const record = await Analytics.create({
      asset_id: new mongoose.Types.ObjectId(),
      view_count: 5,
    });

    const res = await request(app).get(`/api/analytics/${record._id}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe((record._id as mongoose.Types.ObjectId).toString());
    expect(res.body.view_count).toBe(5);
  });

  it('returns 404 if analytics not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/analytics/${fakeId}`);
    expect(res.status).toBe(404);
  });

  it('updates analytics', async () => {
    const record = await Analytics.create({
      asset_id: new mongoose.Types.ObjectId(),
    });

    const res = await request(app)
      .put(`/api/analytics/${record._id}`)
      .send({ view_count: 42, last_viewed_at: new Date() });

    expect(res.status).toBe(200);
    expect(res.body.view_count).toBe(42);

    const updated = await Analytics.findById(record._id).lean();
    expect(updated?.view_count).toBe(42);
  });

  it('returns 404 when updating missing analytics', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).put(`/api/analytics/${fakeId}`).send({ view_count: 1 });
    expect(res.status).toBe(404);
  });

  it('deletes analytics', async () => {
    const record = await Analytics.create({
      asset_id: new mongoose.Types.ObjectId(),
    });

    const res = await request(app).delete(`/api/analytics/${record._id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);

    const check = await Analytics.findById(record._id);
    expect(check).toBeNull();
  });

  it('returns 404 deleting non-existent analytics', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/analytics/${fakeId}`);
    expect(res.status).toBe(404);
  });
});
