import { type AxiosRequestConfig } from 'axios';
import { MESSAGES, MessageInfo } from 'core/src/infrastructure/channel-messaging/messages';
import { generateId } from 'core/src/infrastructure/lib/generate-id';

import { swApiClient } from '../api-client/main';
import { MainDB } from '../db/main';
import { _self } from '../self';
import { AnyPayload } from './types';

const storage = {
    get: async () => {
        const db = await MainDB.getConnection();
        return db.networkSchedulerRequest.toArray();
    },
    add: async (req: AxiosRequestConfig) => {
        const db = await MainDB.getConnection();
        db.networkSchedulerRequest
            .add({
                id: generateId(),
                config: req,
            })
            .then(() => {
                console.log('Request added to Network Scheduler Queue');
            });
    },
};

export const networkScheduler = {
    post: ({ req, payload }: { req: Request; payload: AnyPayload }) => {
        const headers = Object.fromEntries(req.headers.entries());
        const config = {
            headers,
            url: req.url,
            data: payload,
            method: req.method,
        };

        if (navigator.onLine) {
            swApiClient.query(config).then(async ({ data, error }) => {
                console.log('Network Scheduler Request: ', data, error);
            });
        } else {
            storage.add(config);
        }
    },
    execute: async () => {
        if (navigator.onLine) {
            const db = await MainDB.getConnection();
            const reqsToBeDeleted = [];

            const queue = await storage.get();

            for (const req of queue) {
                const { data, error } = await swApiClient.query<any>({
                    ...req.config,
                });
                console.log('Network Scheduler Request: ', data, error);

                if (!error && data?.ok) {
                    reqsToBeDeleted.push(req.id);
                }
            }

            db.networkSchedulerRequest.bulkDelete(reqsToBeDeleted);
        }
    },
};

_self.addEventListener('message', ({ data }) => {
    if (data.type === MESSAGES.NETWORK_STATE_CHANGED) {
        const info = data.info as MessageInfo<'NETWORK_STATE_CHANGED'>;

        if (info.state === 'online') {
            networkScheduler.execute();
        }
    }
});
