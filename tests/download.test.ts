import mongoose from 'mongoose';
import {User} from '../src/models/User';
import {Asset} from '../src/models/Asset';
import {Download} from '../src/models/Download';

describe('Download model', () => {
  let userId: mongoose.Types.ObjectId;
  let assetId: mongoose.Types.ObjectId;

  beforeEach(async () => {
    const u = await User.create({ name: 'DUser', email: 'duser@example.com', password_hash: 'p' });
    userId = u._id as mongoose.Types.ObjectId;
    const a = await Asset.create({ user_id: userId, original_filename: 'd.png', stored_filename: 's-d.png', storage_url: 'url' });
    assetId = a._id as mongoose.Types.ObjectId;
  });

  it('creates a download entry with timestamp', async () => {
    const d = await Download.create({ user_id: userId, asset_id: assetId });
    expect(d._id).toBeDefined();
    expect(d.downloaded_at).toBeDefined();
    expect(String(d.user_id)).toBe(String(userId));
  });

  it('requires user_id and asset_id', async () => {
    await expect(Download.create({} as any)).rejects.toThrow();
  });
});
