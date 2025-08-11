import request from 'supertest';
import app from '../src/app';
import { AssetTag } from '../src/models/AssetTag';
import { Asset } from '../src/models/Asset';
import { Tag } from '../src/models/Tag';
import mongoose from 'mongoose';

describe('AssetTag controller & routes', () => {
  let assetId: mongoose.Types.ObjectId;
  let tagId: mongoose.Types.ObjectId;

  beforeEach(async () => {
    await AssetTag.deleteMany({});
    await Asset.deleteMany({});
    await Tag.deleteMany({});

    const asset = await Asset.create({
      user_id: new mongoose.Types.ObjectId(),
      original_filename: 'photo.jpg',
      stored_filename: 'photo_stored.jpg',
      storage_url: 'http://example.com/photo_stored.jpg'
    });

    const tag = await Tag.create({ name: 'Sample Tag' });

    assetId = asset._id as mongoose.Types.ObjectId;
    tagId = tag._id as mongoose.Types.ObjectId;
  });

  it('creates AssetTag (happy path)', async () => {
    const res = await request(app)
      .post('/api/asset-tags')
      .send({
        asset_id: assetId,
        tag_id: tagId
      });

    expect(res.status).toBe(201);
    expect(res.body.asset_id).toBe(assetId.toString());
    expect(res.body.tag_id).toBe(tagId.toString());
  });

  it('rejects invalid asset_id', async () => {
    const res = await request(app)
      .post('/api/asset-tags')
      .send({
        asset_id: 'invalid',
        tag_id: tagId
      });

    expect(res.status).toBe(400);
    expect(res.body.message || res.body.error).toMatch(/Error/i);
  });

  it('gets AssetTag by id', async () => {
    const record = await AssetTag.create({
      asset_id: assetId,
      tag_id: tagId
    });

    const res = await request(app).get(`/api/asset-tags/${record._id}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe((record._id as mongoose.Types.ObjectId).toString());
  });

  it('returns 404 if AssetTag not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/asset-tags/${fakeId}`);
    expect(res.status).toBe(404);
  });

  it('gets all AssetTags', async () => {
    await AssetTag.create({ asset_id: assetId, tag_id: tagId });

    const res = await request(app).get('/api/asset-tags');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  it('deletes AssetTag', async () => {
    const record = await AssetTag.create({
      asset_id: assetId,
      tag_id: tagId
    });

    const res = await request(app).delete(`/api/asset-tags/${record._id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);

    const check = await AssetTag.findById(record._id);
    expect(check).toBeNull();
  });

  it('returns 404 deleting non-existent AssetTag', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/asset-tags/${fakeId}`);
    expect(res.status).toBe(404);
  });
});
