import { apiClient } from '~/interface/shared/api-client/mod.api-client';

import { type Document } from 'core/src/domain/document/types';

export const api = {
  async create({ data }: { data: OmitStrict<Document, 'lastUpdatedTime' | 'id'> }) {
    return apiClient.query<{ ok: boolean }>({
      url: 'document/create',
      method: 'POST',
      data,
    });
  },

  async remove({ data }: { data: Pick<Document, 'id'> }) {
    return apiClient.query<{ ok: boolean }>({
      url: 'document/remove',
      method: 'POST',
      data,
    });
  },

  async pull() {
    return apiClient.query<{ ok: boolean; items: Document[] }>({
      url: 'document/pull',
      method: 'GET',
    });
  },

  async pullCloud() {
    return apiClient.query<{ ok: boolean; items: Document[]; updated: boolean }>({
      url: 'document/pullCloud',
      method: 'GET',
    });
  },
};
