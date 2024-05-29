import { type Cv } from 'core/src/domain/cv/types';
import { CvStrictSchema } from 'core/src/domain/cv/validation';
import { z } from 'zod';
import { swApiClient } from '~/service-worker/infrastructure/api-client/mod.api-client';

export const couldApi = {
    async getRemotelyStored() {
        return swApiClient.query<{ ok: boolean; items: Cv[] }>({
            parsedRequest: {
                url: 'cv/get',
                method: 'GET',
            },
        });
    },

    async create({ payload }: { payload: z.infer<typeof CvStrictSchema> }) {
        return swApiClient.query<{ ok: boolean }>({
            parsedRequest: {
                url: 'cv/create',
                method: 'POST',
                payload,
            },
        });
    },
};
