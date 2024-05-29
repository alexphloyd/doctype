import { generateId } from 'core/src/infrastructure/lib/generate-id';
import { NETWORK_MESSAGES } from 'core/src/infrastructure/networking/channel-messaging';

import { swApiClient } from '../api-client/mod.api-client';
import { type AnyPayload } from '../api-client/types';
import { MainDB } from '../db/mod.db';
import { parseRequestInstance } from '../lib/request.parser';
import { messageChannel } from '../message-channel/mod.message-channel';

const storage = {
    get: async () => {
        const db = await MainDB.getConnection();
        return db.networkSchedulerRequest.toArray();
    },
    add: async ({ req, payload }: { req: Request; payload?: AnyPayload }) => {
        const db = await MainDB.getConnection();
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
        console.log('execute');
        if (navigator.onLine) {
            const db = await MainDB.getConnection();
            const reqsToBeDeleted = [];
            const queue = await storage.get();

            if (queue.length) {
                for (const { req, id } of queue) {
                    const response = await swApiClient.query<any>({
                        parsedRequest: req,
                    });

                    if (response?.data?.ok && !response.error) {
                        reqsToBeDeleted.push(id);
                    }
                }

                if (queue.length === reqsToBeDeleted.length) {
                    messageChannel.post(NETWORK_MESSAGES.CLOUD_STORAGE_SYNCED);
                }

                db.networkSchedulerRequest.bulkDelete(reqsToBeDeleted).catch(() => {});
            }
        }
    },
};

messageChannel.on(NETWORK_MESSAGES.ONLINE, () => {
    networkScheduler.execute();
});
