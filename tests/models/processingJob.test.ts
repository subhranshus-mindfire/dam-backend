import mongoose from 'mongoose';
import {User} from '../../src/models/User';
import {Asset} from '../../src/models/Asset';
import {ProcessingJob} from '../../src/models/ProcessingJob';

describe('ProcessingJob model', () => {
  let userId: mongoose.Types.ObjectId;
  let assetId: mongoose.Types.ObjectId;

  beforeEach(async () => {
    const u = await User.create({ name: 'PJUser', email: 'pj@example.com', password_hash: 'p' });
    userId = u._id as mongoose.Types.ObjectId;
    const a = await Asset.create({ user_id: userId, original_filename: 'pj.mov', stored_filename: 's-pj.mov', storage_url: 'u' });
    assetId = a._id as mongoose.Types.ObjectId;
  });

  it('creates job and updates status fields', async () => {
    const job = await ProcessingJob.create({ asset_id: assetId, job_type: 'transcode', status: 'pending' });
    expect(job._id).toBeDefined();
    expect(job.status).toBe('pending');

    job.status = 'in_progress';
    job.started_at = new Date();
    await job.save();

    const reloaded = await ProcessingJob.findById(job._id);
    expect(reloaded?.status).toBe('in_progress');

    reloaded!.status = 'done';
    reloaded!.finished_at = new Date();
    await reloaded!.save();

    const done = await ProcessingJob.findById(job._id);
    expect(done?.status).toBe('done');
    expect(done?.finished_at).toBeDefined();
  });

  it('requires asset_id', async () => {
    await expect(ProcessingJob.create({} as any)).rejects.toThrow();
  });
});
