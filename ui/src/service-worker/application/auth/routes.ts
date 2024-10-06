import { type User } from '@prisma/client';
import { AxiosError } from 'axios';
import { swApiClient } from '~/service-worker/infrastructure/api-client/mod.api-client';
import { parseRequestInstance } from '~/service-worker/infrastructure/lib/request.parser';
import { networkScheduler } from '~/service-worker/infrastructure/network-scheduler/mod.network-scheduler';
import { router } from '~/service-worker/infrastructure/router/mod.router';
import {
  prepareErrorResponse,
  prepareResponse,
} from '~/service-worker/infrastructure/router/prepare-response';
import { authService } from '~/service-worker/services/auth.service';

import { type Tokens } from 'core/src/domain/auth/types';

import { claimNotesToSession } from '../note/claim-to-session';

async function loginHandler(ev: FetchEvent) {
  const clonedReq = ev.request.clone();
  const payload = clonedReq.body && (await clonedReq.json());

  const query = await swApiClient.query<{ user: User; tokens: Tokens }>({
    parsedRequest: parseRequestInstance(clonedReq, payload),
  });

  if (query.data) {
    await authService.updateTokens(query.data.tokens);
    await authService.updateSession({ user: query.data.user });

    await networkScheduler.execute();
    claimNotesToSession();

    return prepareResponse(query.data);
  } else {
    return prepareErrorResponse(query.error);
  }
}

export function registerAuthRoutes() {
  router.register({
    path: 'auth/login',
    handler: loginHandler,
  });
  router.register({
    path: 'auth/google-login',
    handler: loginHandler,
  });

  router.register({
    path: 'auth/session',
    handler: async (ev) => {
      const tokens = await authService.getTokens();

      if (!tokens) {
        return prepareErrorResponse(new AxiosError('Authorization Tokens is not defined'));
      }

      const query = await swApiClient.query<{ user: User }>({
        parsedRequest: parseRequestInstance(ev.request),
      });

      if (query.data) {
        await authService.updateSession({ user: query.data.user });
        await claimNotesToSession();

        return prepareResponse(query.data);
      } else {
        return prepareErrorResponse(query.error);
      }
    },
  });

  router.register({
    path: 'auth/exchange-github-token',
    handler: async (ev) => {
      const clonedReq = ev.request.clone();
      const query = await swApiClient.query<{ tokens: Tokens }>({
        parsedRequest: parseRequestInstance(clonedReq),
      });

      if (query.data) {
        const { access, refresh } = query.data.tokens;
        await authService.updateTokens({ access, refresh });

        return prepareResponse({ ok: true });
      } else {
        return prepareErrorResponse(new AxiosError('Authorization Tokens is not defined'));
      }
    },
  });
}
