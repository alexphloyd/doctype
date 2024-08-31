import { generateId } from 'core/src/infrastructure/lib/generate-id';
import { NETWORK_MESSAGES } from 'core/src/infrastructure/networking/channel-messaging';

import { swApiClient } from '../api-client/mod.api-client';
import { type AnyPayload } from '../api-client/types';
import { LocalDB } from '../db/mod.db';
import { parseRequestInstance } from '../lib/request.parser';
import { swMessageChannel } from '../message-channel/mod.message-channel';

const storage = {
  get: async () => {
    const db = await LocalDB.getConnection();
    return db.networkSchedulerRequest.toArray();
  },
  add: async ({ req, payload }: { req: Request; payload?: AnyPayload }) => {
    const db = await LocalDB.getConnection();
    db.networkSchedulerRequest.add({
      id: generateId(),
      req: parseRequestInstance(req, payload),
    });
  },
};

export const networkScheduler = {
  post: ({ req, payload }: { req: Request; payload: AnyPayload }) => {
    if (navigator.onLine) {
      swApiClient.query({
        parsedRequest: parseRequestInstance(req, payload),
      });
    } else {
      storage.add({ req, payload });
    }
  },
  execute: async () => {
    if (navigator.onLine) {
      const db = await LocalDB.getConnection();

      const queue = await storage.get();
      const succeed = [];

      if (queue.length) {
        for (const { req, id } of queue) {
          const response = await swApiClient.query<any>({
            parsedRequest: req,
          });

          if (response.error?.code !== 'ERR_NETWORK') {
            succeed.push(id);
          }
        }

        if (succeed.length > 0) {
          swMessageChannel.post(NETWORK_MESSAGES.SAVED_TO_CLOUD);
        }

        db.networkSchedulerRequest.bulkDelete(succeed).catch(() => {});
      }
    }
  },
};

swMessageChannel.on(NETWORK_MESSAGES.ONLINE, () => {
  networkScheduler.execute();
});
