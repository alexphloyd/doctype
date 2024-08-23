import { AxiosError } from 'axios';
import { type Document } from 'core/src/domain/document/types';
import { DocumentSchema } from 'core/src/domain/document/validation';
import { generateId } from 'core/src/infrastructure/lib/generate-id';
import dayjs from 'dayjs';
import { networkScheduler } from '~/service-worker/infrastructure/network-scheduler/mod.network-scheduler';
import { router } from '~/service-worker/infrastructure/router/mod.router';
import {
  prepareErrorResponse,
  prepareResponse,
} from '~/service-worker/infrastructure/router/prepare-response';

import { cloudApi } from './cloud.api';
import { authService } from '~/service-worker/services/auth.service';

export function registerDocumentRoutes() {
  router.register({
    path: 'document/create',
    handler: async (ev, db) => {
      const body = await ev.request.json();
      const parsedBody = DocumentSchema.pick({ name: true }).parse(body);

      const session = await authService.getSession();

      const payload = {
        ...parsedBody,
        id: generateId(),
        lastUpdatedTime: dayjs().toString(),
        userId: session?.current.id,
      };
      const created = await db.document.add(payload);

      if (payload.userId) {
        networkScheduler.post({ req: ev.request, payload });
      }

      return prepareResponse({
        ok: Boolean(created),
      });
    },
  });

  router.register({
    path: 'document/remove',
    handler: async (ev, db) => {
      const body = await ev.request.json();
      const parsedBody = DocumentSchema.pick({ id: true }).parse(body);

      const session = await authService.getSession();
      await db.document.delete(parsedBody.id);

      if (session?.current.id) {
        networkScheduler.post({ req: ev.request, payload: parsedBody });
      }

      return prepareResponse({
        ok: true,
      });
    },
  });

  router.register({
    path: 'document/rename',
    handler: async (ev, db) => {
      const body = await ev.request.json();
      const parsedBody = DocumentSchema.pick({ name: true, id: true }).parse(body);

      const session = await authService.getSession();

      const renamed = await db.document
        .update(parsedBody.id, {
          name: parsedBody.name,
        })
        .catch(() => undefined);

      if (session?.id) {
        const cloudReqPayload = {
          id: parsedBody.id,
          name: parsedBody.name,
        } satisfies Pick<Document, 'id' | 'name'>;

        networkScheduler.post({ req: ev.request, payload: cloudReqPayload });
      }

      return prepareResponse({
        ok: Boolean(renamed),
      });
    },
  });

  router.register({
    path: 'document/getLocallyStored',
    handler: async (_ev, db) => {
      try {
        const docs = await db.document.toArray();
        const sorted = docs?.sort((a, b) => {
          return dayjs(a.lastUpdatedTime).diff(dayjs(b.lastUpdatedTime));
        });

        return prepareResponse({
          ok: true,
          items: sorted,
        });
      } catch {
        return prepareErrorResponse(new AxiosError());
      }
    },
  });

  router.register({
    path: 'document/getWithRemotelyStored',
    handler: async (_ev, db) => {
      const authorizationData = await authService.getTokens();
      if (!navigator.onLine || !authorizationData) {
        return prepareResponse({
          ok: false,
        });
      }

      const query = await cloudApi.getRemotelyStored();

      if (query.data?.ok) {
        let updated = false;
        const local = await db.document.toArray();
        const receivedRemotely = query.data.items;

        receivedRemotely.forEach(async (remoteDoc) => {
          const same = local.find((localDoc) => localDoc.id === remoteDoc.id);
          if (same) {
            const isNewer = dayjs(remoteDoc.lastUpdatedTime).isAfter(same.lastUpdatedTime);
            if (isNewer) {
              await db.document
                .update(same.id, remoteDoc)
                .then(() => (updated = true))
                .catch(() => {});
            }
          } else {
            await db.document
              .add(remoteDoc)
              .then(() => (updated = true))
              .catch(() => {});
          }
        });

        const merged = (await db.document.toArray()).sort((a, b) => {
          return dayjs(a.lastUpdatedTime).diff(dayjs(b.lastUpdatedTime));
        });

        return prepareResponse({
          ok: true,
          items: merged,
          updated,
        });
      } else {
        return prepareErrorResponse(new AxiosError());
      }
    },
  });
}
