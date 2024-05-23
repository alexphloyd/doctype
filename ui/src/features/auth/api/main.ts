import type { User } from '@prisma/client';
import { LoginDto, SignUpDto, VerificationDto } from 'core/src/domain/auth/validation';
import { z } from 'zod';

import { apiClient } from '~/shared/api-client/main';

import type { Tokens } from '../model/types';

export const api = {
    async session() {
        return apiClient.query<{ user: User }>({
            url: 'auth/session',
            method: 'GET',
        });
    },

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

    async loginWithOAuth({ oauthToken }: { oauthToken: string | undefined }) {
        return apiClient.query<{
            tokens: Tokens;
            user: User;
        }>({
            url: 'auth/loginWithOAuth',
            method: 'GET',
            headers: {
                oauth: oauthToken,
            },
        });
    },

    async signUp({ data }: { data: z.infer<typeof SignUpDto> }) {
        return apiClient.query<{ createdUser: User }>({
            url: 'auth/sign-up',
            method: 'POST',
            data,
        });
    },

    async verify({ data }: { data: z.infer<typeof VerificationDto> }) {
        return apiClient.query<{
            verified: boolean;
        }>({
            url: 'auth/verify',
            method: 'PUT',
            data,
        });
    },
};
