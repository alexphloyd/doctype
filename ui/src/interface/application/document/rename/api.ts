import { apiClient } from '~/interface/shared/api-client/mod.api-client';

import { type Document } from 'core/src/domain/document/types';

export const api = {
  async rename({ data }: { data: Pick<Document, 'name' | 'id'> }) {
    return apiClient.query<{ ok: boolean }>({
      url: 'document/rename',
      method: 'POST',
      data,
    });
  },
};
