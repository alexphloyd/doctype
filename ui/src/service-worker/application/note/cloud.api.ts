import { z } from 'zod';
import { swApiClient } from '~/service-worker/infrastructure/api-client/mod.api-client';

import { type Note } from 'core/src/domain/note/types';
import { NoteStrictSchema } from 'core/src/domain/note/validation';

export const cloudApi = {
  async getRemotelyStored() {
    return swApiClient.query<{ ok: boolean; items: Note[] }>({
      parsedRequest: {
        url: 'note/get',
        method: 'GET',
      },
    });
  },

  async create({ payload }: { payload: z.infer<typeof NoteStrictSchema> }) {
    return swApiClient.query<{ ok: boolean }>({
      parsedRequest: {
        url: 'note/create',
        method: 'POST',
        payload,
      },
    });
  },
};
