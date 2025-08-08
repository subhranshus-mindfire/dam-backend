import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

export const processingQueue = new Queue('processingQueue', {
  connection: redisConnection,
});
