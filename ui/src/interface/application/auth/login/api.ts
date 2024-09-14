import type { User } from '@prisma/client';
import { z } from 'zod';
import { Tokens } from '~/interface/domain/auth';
import { apiClient } from '~/interface/shared/api-client/mod.api-client';

import { LoginDto } from 'core/src/domain/auth/validation';

export const api = {
  async login({ data }: { data: z.infer<typeof LoginDto> }) {
    return apiClient.query<{
      tokens: Tokens;
      user: User;
    }>({
      url: 'auth/login',
      method: 'POST',
      data,
    });
  },

  async loginWithGoogle({ googleToken }: { googleToken: string | undefined }) {
    return apiClient.query<{
      tokens: Tokens;
      user: User;
    }>({
      url: 'auth/loginWithGoogle',
      method: 'GET',
      headers: {
        oauth: googleToken,
      },
    });
  },
};
