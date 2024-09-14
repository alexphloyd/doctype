import type { User } from '@prisma/client';
import { apiClient } from '~/interface/shared/api-client/mod.api-client';

export const api = {
  async getSession() {
    return apiClient.query<{ user: User }>({
      url: 'auth/session',
      method: 'GET',
    });
  },
};
