import request from 'supertest';
import app from '../../src/app';
import { Tag } from '../../src/models/Tag';
import mongoose from 'mongoose';

describe('Tag controller & routes', () => {
  beforeEach(async () => {
    await Tag.deleteMany({});
  });

  it('creates a tag (happy path)', async () => {
    const res = await request(app)
      .post('/api/tags')
      .send({ name: 'Nature' });

    expect(res.status).toBe(201);
    expect(res.body._id).toBeDefined();
    expect(res.body.name).toBe('Nature');
  });

  it('rejects missing name', async () => {
    const res = await request(app).post('/api/tags').send({});
    expect(res.status).toBe(400);
  });

  it('rejects duplicate name', async () => {
    await Tag.create({ name: 'Travel' });

    const res = await request(app)
      .post('/api/tags')
      .send({ name: 'Travel' });

    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/exists/i);
  });

  it('returns list of tags', async () => {
    await Tag.create({ name: 'One' });
    await Tag.create({ name: 'Two' });

    const res = await request(app).get('/api/tags');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  it('gets tag by id', async () => {
    const tag = await Tag.create({ name: 'Wildlife' });

    const res = await request(app).get(`/api/tags/${tag._id}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Wildlife');
  });

  it('returns 404 for non-existent ID', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/tags/${fakeId}`);
    expect(res.status).toBe(404);
  });

  it('deletes a tag', async () => {
    const tag = await Tag.create({ name: 'DeleteMe' });

    const res = await request(app).delete(`/api/tags/${tag._id}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);

    const check = await Tag.findById(tag._id);
    expect(check).toBeNull();
  });

  it('returns 404 deleting non-existent tag', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/tags/${fakeId}`);
    expect(res.status).toBe(404);
  });
});
