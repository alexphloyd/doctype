import { apiClient } from '~/interface/shared/api-client/mod.api-client';

import { type Note } from 'core/src/domain/note/types';

export const api = {
  async rename({ data }: { data: Pick<Note, 'name' | 'id'> }) {
    return apiClient.query<{ ok: boolean }>({
      url: 'note/rename',
      method: 'POST',
      data,
    });
  },
};
