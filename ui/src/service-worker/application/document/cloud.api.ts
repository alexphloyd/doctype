import { type Document } from 'core/src/domain/document/types';
import { DocumentStrictSchema } from 'core/src/domain/document/validation';
import { z } from 'zod';
import { swApiClient } from '~/service-worker/infrastructure/api-client/mod.api-client';

export const cloudApi = {
  async getRemotelyStored() {
    return swApiClient.query<{ ok: boolean; items: Document[] }>({
      parsedRequest: {
        url: 'document/get',
        method: 'GET',
      },
    });
  },

  async create({ payload }: { payload: z.infer<typeof DocumentStrictSchema> }) {
    return swApiClient.query<{ ok: boolean }>({
      parsedRequest: {
        url: 'document/create',
        method: 'POST',
        payload,
      },
    });
  },
};
