import mongoose from 'mongoose';
import {User} from '../../src/models/User';
import {Asset} from '../../src/models/Asset';
import {Analytics} from '../../src/models/Analytics';

describe('Analytics model', () => {
  let userId: mongoose.Types.ObjectId;
  let assetId: mongoose.Types.ObjectId;

  beforeEach(async () => {
    const u = await User.create({ name: 'AUser', email: 'auser@example.com', password_hash: 'p' });
    userId = u._id as mongoose.Types.ObjectId;
    const a = await Asset.create({ user_id: userId, original_filename: 'a.jpg', stored_filename: 's-a.jpg', storage_url: 'u' });
    assetId = a._id as mongoose.Types.ObjectId;
  });

  it('creates analytics doc with defaults', async () => {
    const an = await Analytics.create({ asset_id: assetId });
    expect(an._id).toBeDefined();
    expect(an.view_count).toBe(0);
    expect(an.download_count).toBe(0);
  });

  it('increments counts correctly', async () => {
    const an = await Analytics.create({ asset_id: assetId });
    an.view_count = (an.view_count || 0) + 5;
    an.download_count = (an.download_count || 0) + 2;
    an.last_viewed_at = new Date();
    await an.save();

    const re = await Analytics.findById(an._id);
    expect(re?.view_count).toBe(5);
    expect(re?.download_count).toBe(2);
    expect(re?.last_viewed_at).toBeDefined();
  });

  it('requires asset_id', async () => {
    await expect(Analytics.create({} as any)).rejects.toThrow();
  });
});
