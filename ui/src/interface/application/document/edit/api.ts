import { apiClient } from '~/interface/shared/api-client/mod.api-client';

import { type Document } from 'core/src/domain/document/types';

export const api = {
  async getById({ id }: { id: Document['id'] }) {
    return apiClient.query<{ ok: boolean; doc: Document }>({
      url: 'document/getById',
      method: 'POST',
      data: {
        id,
      },
    });
  },

  async updateSource({ id, source }: Pick<Document, 'id' | 'source'>) {
    return apiClient.query<{ ok: boolean }>({
      url: 'document/updateSource',
      method: 'POST',
      data: {
        id,
        source,
      },
    });
  },
};
