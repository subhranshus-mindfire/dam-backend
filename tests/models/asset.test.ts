import mongoose from 'mongoose';
import {User} from '../../src/models/User';
import {Asset} from '../../src/models/Asset';

describe('Asset model', () => {
  let userId: mongoose.Types.ObjectId;

  beforeEach(async () => {
    const u = await User.create({ name: 'Uploader', email: 'uploader@example.com', password_hash: 'p' });
    userId = u._id as mongoose.Types.ObjectId;
  });

  it('creates an asset successfully', async () => {
    const asset = await Asset.create({
      user_id: userId,
      original_filename: 'photo.jpg',
      stored_filename: 'uuid-photo.jpg',
      storage_url: 'http://minio/originals/uuid-photo.jpg',
      preview_url: 'http://minio/previews/uuid-photo.jpg',
      thumbnail_url: 'http://minio/thumbs/uuid-photo.jpg',
      type: 'image/jpeg'
    });

    expect(asset._id).toBeDefined();
    expect(String(asset.user_id)).toBe(String(userId));
    expect(asset.original_filename).toBe('photo.jpg');
  });

  it('requires user_id and required file fields', async () => {
    await expect(Asset.create({} as any)).rejects.toThrow();
    await expect(
      Asset.create({ user_id: userId, original_filename: 'a.jpg' } as any)
    ).rejects.toThrow();
  });
});
