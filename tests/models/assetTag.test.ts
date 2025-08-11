import mongoose from 'mongoose';
import {User} from '../../src/models/User';
import {Asset} from '../../src/models/Asset';
import {Tag} from '../../src/models/Tag';
import {AssetTag} from '../../src/models/AssetTag';

describe('AssetTag (join) model', () => {
  let userId: mongoose.Types.ObjectId;
  let assetId: mongoose.Types.ObjectId;
  let tagId: mongoose.Types.ObjectId;

  beforeEach(async () => {
    const u = await User.create({ name: 'AT User', email: 'atuser@example.com', password_hash: 'p' });
    userId = u._id as mongoose.Types.ObjectId;
    const a = await Asset.create({
      user_id: userId,
      original_filename: 'v.mp4',
      stored_filename: 'uuid-v.mp4',
      storage_url: 'http://minio/uuid-v.mp4'
    }); 
    assetId = a._id as mongoose.Types.ObjectId;
    const t = await Tag.create({ name: 'promo' });
    tagId = t._id as mongoose.Types.ObjectId;
  });

  it('links asset and tag', async () => {
    const link = await AssetTag.create({ asset_id: assetId, tag_id: tagId });
    expect(link._id).toBeDefined();
    expect(String(link.asset_id)).toBe(String(assetId));
    expect(String(link.tag_id)).toBe(String(tagId));
  });

  it('requires asset_id and tag_id', async () => {
    await expect(AssetTag.create({} as any)).rejects.toThrow();
  });

  // If you added a unique composite index on (asset_id, tag_id),
  // uncomment the below test to assert duplicate insertion is disallowed.
  /*
  it('prevents duplicate tag links (if unique index exists)', async () => {
    await AssetTag.create({ asset_id: assetId, tag_id: tagId });
    await expect(AssetTag.create({ asset_id: assetId, tag_id: tagId })).rejects.toThrow();
  });
  */
});
