import { generateId } from 'core/src/infrastructure/lib/generate-id';

import { swApiClient } from '../api-client/main';
import { type AnyPayload } from '../api-client/types';
import { MainDB } from '../db/main';
import { parseRequestInstance } from '../lib/request.parser';
import { messageChannel } from '../message-channel/main';

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
            swApiClient.query({ parsedRequest: parseRequestInstance(req, payload) });
        } else {
            storage.add({ req, payload });
        }
    },
    execute: async () => {
        if (navigator.onLine) {
            const db = await MainDB.getConnection();
            const reqsToBeDeleted = [];

            const queue = await storage.get();

            for (const { req, id } of queue) {
                const response = await swApiClient.query<any>({
                    parsedRequest: req,
                });

                if (response?.data?.o && !response.error) {
                    reqsToBeDeleted.push(id);
                }
            }

            db.networkSchedulerRequest.bulkDelete(reqsToBeDeleted);
        }
    },
};

messageChannel.on('NETWORK_STATE_CHANGED', (info) => {
    if (info.state === 'online') {
        networkScheduler.execute();
    }
});
