import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { networkScheduler } from '~/service-worker/infrastructure/network-scheduler/mod.network-scheduler';
import { router } from '~/service-worker/infrastructure/router/mod.router';
import {
  prepareErrorResponse,
  prepareResponse,
} from '~/service-worker/infrastructure/router/prepare-response';
import { authService } from '~/service-worker/services/auth.service';

import { type Document } from 'core/src/domain/document/types';
import { DocumentSchema } from 'core/src/domain/document/validation';
import { generateId } from 'core/src/infrastructure/lib/generate-id';

import { cloudApi } from './cloud.api';

export function registerDocumentRoutes() {
  router.register({
    path: 'document/create',
    handler: async (ev, db) => {
      const body = await ev.request.json();
      const parsedBody = DocumentSchema.pick({ name: true, source: true }).parse(body);

      const session = await authService.getSession();

      const payload = {
        ...parsedBody,
        id: generateId(),
        lastUpdatedTime: dayjs().toString(),
        userId: session?.current.id,
      };
      const created = await db.document.add(payload);

      networkScheduler.post({ req: ev.request, payload });

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
          lastUpdatedTime: dayjs().toString(),
        } satisfies Pick<Document, 'id' | 'name' | 'lastUpdatedTime'>;

        networkScheduler.post({ req: ev.request, payload: cloudReqPayload });
      }

      return prepareResponse({
        ok: Boolean(renamed),
      });
    },
  });

  router.register({
    path: 'document/pull',
    handler: async (_ev, db) => {
      try {
        const docs = await db.document.toArray();
        const sorted = docs?.sort((a, b) => {
          return dayjs(b.lastUpdatedTime).diff(dayjs(a.lastUpdatedTime));
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
    path: 'document/pullCloud',
    handler: async (_ev, db) => {
      const authTokens = await authService.getTokens();
      if (!navigator.onLine || !authTokens) {
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
          const localDoc = local.find((localDoc) => localDoc.id === remoteDoc.id);
          if (localDoc) {
            const upgradeRequired = dayjs(remoteDoc.lastUpdatedTime).isAfter(
              localDoc.lastUpdatedTime
            );

            if (upgradeRequired) {
              await db.document
                .update(localDoc.id, remoteDoc)
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
          return dayjs(b.lastUpdatedTime).diff(dayjs(a.lastUpdatedTime));
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

  router.register({
    path: 'document/getById',
    handler: async (ev, db) => {
      const body = await ev.request.json();
      const parsedBody = DocumentSchema.pick({ id: true }).parse(body);
      const doc = await db.document.get(parsedBody.id);

      if (doc) {
        return prepareResponse({
          ok: true,
          doc,
        });
      } else {
        return prepareErrorResponse(new AxiosError('Document is not defined.'));
      }
    },
  });

  router.register({
    path: 'document/updateSource',
    handler: async (ev, db) => {
      const body = await ev.request.json();
      const { id, source } = DocumentSchema.pick({ id: true, source: true }).parse(body);

      const lastUpdatedTime = dayjs().toString();
      const update = await db.document.update(id, {
        source,
        lastUpdatedTime,
      });

      networkScheduler.post({ req: ev.request, payload: { id, source, lastUpdatedTime } });

      if (update) {
        return prepareResponse({
          ok: true,
        });
      } else {
        return prepareErrorResponse(new AxiosError('Document Source is not updated.'));
      }
    },
  });
}
