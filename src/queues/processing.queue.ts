import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis.connection';

export const processingQueue = new Queue('processingQueue', {
  connection: redisConnection,
});
