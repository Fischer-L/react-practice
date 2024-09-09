
import { createClient } from 'redis';
const Redis = require("ioredis");
import Redlock from 'redlock';

import config from '@react-practice/backend/config';

const redisClient = new Redis();
const redlock = new Redlock(
  // You should have one client for each independent redis node or cluster.
  [ redisClient ],
  { 
    retryCount: 1,
  }
);

export async function acquireLock(key: string) {
  try {
    console.log('TMP: acquire lock:', key);
    const lock = await redlock.acquire([ `lock:${key}` ], config.RED_LOCK_TTL, {
      retryDelay: 100,
      retryCount: 10,
      automaticExtensionThreshold: 100,
      retryJitter: 1000,
    });
    return lock;
  } catch (e) {
    // Unable to acquire lock
    return null;
  }
}

export function releaseLock(lock) {
    redlock.release(lock);
}
