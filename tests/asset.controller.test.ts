import request from 'supertest';
import app from '../src/app';
import { Asset } from '../src/models/Asset';
import mongoose from 'mongoose';

describe('Asset controller & routes', () => {
  beforeEach(async () => {
    await Asset.deleteMany({});
  });

  it('creates asset (happy path)', async () => {
    const userId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .post('/api/assets')
      .send({
        user_id: userId,
        original_filename: 'image.jpg',
        stored_filename: '12345.jpg',
        storage_url: 'http://example.com/12345.jpg',
        type: 'image/jpeg'
      });

    expect(res.status).toBe(201);
    expect(res.body._id).toBeDefined();
    expect(res.body.user_id).toBe(userId.toString());
    expect(res.body.original_filename).toBe('image.jpg');
  });

  it('rejects invalid user_id', async () => {
    const res = await request(app)
      .post('/api/assets')
      .send({
        user_id: 'invalid',
        original_filename: 'file.jpg',
        stored_filename: 'file123.jpg',
        storage_url: 'http://example.com/file123.jpg'
      });

    expect(res.status).toBe(400);
    expect(res.body.message || res.body.error).toMatch(/invalid/i);
  });

  it('gets asset by id', async () => {
    const record = await Asset.create({
      user_id: new mongoose.Types.ObjectId(),
      original_filename: 'photo.jpg',
      stored_filename: 'abc123.jpg',
      storage_url: 'http://example.com/abc123.jpg'
    });

    const res = await request(app).get(`/api/assets/${record._id}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe((record._id as mongoose.Types.ObjectId).toString());
    expect(res.body.original_filename).toBe('photo.jpg');
  });

  it('returns 404 if asset not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/assets/${fakeId}`);
    expect(res.status).toBe(404);
  });

  it('updates asset', async () => {
    const record = await Asset.create({
      user_id: new mongoose.Types.ObjectId(),
      original_filename: 'doc.pdf',
      stored_filename: 'doc123.pdf',
      storage_url: 'http://example.com/doc123.pdf'
    });

    const res = await request(app)
      .put(`/api/assets/${record._id}`)
      .send({ original_filename: 'updated.pdf' });

    expect(res.status).toBe(200);
    expect(res.body.original_filename).toBe('updated.pdf');

    const updated = await Asset.findById(record._id).lean();
    expect(updated?.original_filename).toBe('updated.pdf');
  });

  it('returns 404 when updating missing asset', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).put(`/api/assets/${fakeId}`).send({ original_filename: 'test.jpg' });
    expect(res.status).toBe(404);
  });

  it('deletes asset', async () => {
    const record = await Asset.create({
      user_id: new mongoose.Types.ObjectId(),
      original_filename: 'delete.jpg',
      stored_filename: 'del123.jpg',
      storage_url: 'http://example.com/del123.jpg'
    });

    const res = await request(app).delete(`/api/assets/${record._id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);

    const check = await Asset.findById(record._id);
    expect(check).toBeNull();
  });

  it('returns 404 deleting non-existent asset', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/assets/${fakeId}`);
    expect(res.status).toBe(404);
  });
});
