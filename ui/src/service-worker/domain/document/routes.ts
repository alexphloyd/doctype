import { AxiosError } from 'axios';
import { DocumentSchema } from 'core/src/domain/document/validation';
import { generateId } from 'core/src/infrastructure/lib/generate-id';
import dayjs from 'dayjs';
import { networkScheduler } from '~/service-worker/infrastructure/network-scheduler/mod.network-scheduler';
import { router } from '~/service-worker/infrastructure/router/mod.router';
import {
    prepareErrorResponse,
    prepareResponse,
} from '~/service-worker/infrastructure/router/prepare-response';
import { authService } from '~/service-worker/infrastructure/services/auth.service';

import { cloudApi } from './cloud.api';

export function registerDocumentRoutes() {
    router.register({
        path: 'document/create',
        handler: async (ev, db) => {
            const body = await ev.request.json();
            const parsedBody = DocumentSchema.pick({ title: true }).parse(body);

            const session = await authService.getSession();

            const payload = {
                ...parsedBody,
                id: generateId(),
                creationDate: dayjs().toString(),
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
        path: 'document/getLocallyStored',
        handler: async (_ev, db) => {
            try {
                const docs = await db.document.toArray();
                const sorted = docs?.sort((a, b) => {
                    return dayjs(a.creationDate).diff(dayjs(b.creationDate));
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
                        const isNewer = dayjs(remoteDoc.creationDate).isAfter(
                            same.creationDate
                        );
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
                    return dayjs(a.creationDate).diff(dayjs(b.creationDate));
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
