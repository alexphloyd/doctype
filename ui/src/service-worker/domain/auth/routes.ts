import { type User } from '@prisma/client';
import { type Tokens } from 'core/src/domain/auth/types';
import { swApiClient } from '~/service-worker/infrastructure/api-client/mod.api-client';
import { parseRequestInstance } from '~/service-worker/infrastructure/lib/request.parser';
import { router } from '~/service-worker/infrastructure/router/mod.router';
import { prepareResponse } from '~/service-worker/infrastructure/router/prepare-response';
import { authService } from '~/service-worker/infrastructure/services/auth.service';

async function loginHandler(ev: FetchEvent) {
    try {
        const queryResponse = await fetch(ev.request.clone());
        const res = (await queryResponse.clone().json()) as { user: User; tokens: Tokens };

        await authService.updateTokens(res.tokens);

        return queryResponse;
    } catch {
        return prepareResponse('Login failed.');
    }
}

export function registerAuthRoutes() {
    router.register({
        path: 'auth/login',
        handler: loginHandler,
    });
    router.register({
        path: 'auth/loginWithOAuth',
        handler: loginHandler,
    });
    router.register({
        path: 'auth/session',
        handler: async (ev) => {
            const queryResponse = await swApiClient
                .query<{ user: User; tokens: Tokens }>({
                    parsedRequest: parseRequestInstance(ev.request),
                })
                .then((session) => prepareResponse(session));

            return queryResponse;
        },
    });
}
