import { AxiosError } from 'axios';
import { CvSchema } from 'core/src/domain/cv/validation';
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

export function registerCvRoutes() {
    router.register({
        path: 'cv/create',
        handler: async (ev, db) => {
            const body = await ev.request.json();
            const parsedBody = CvSchema.pick({ title: true }).parse(body);

            const session = await authService.getSession();

            const payload = {
                ...parsedBody,
                id: generateId(),
                creationDate: dayjs().toString(),
                userId: session?.current.id,
            };
            const created = await db.cv.add(payload);

            if (payload.userId) {
                networkScheduler.post({ req: ev.request, payload });
            }

            return prepareResponse({
                ok: Boolean(created),
            });
        },
    });

    router.register({
        path: 'cv/getLocallyStored',
        handler: async (_ev, db) => {
            try {
                const cvs = await db.cv.toArray();
                const sorted = cvs?.sort((a, b) => {
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
        path: 'cv/getWithRemotelyStored',
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
                const local = await db.cv.toArray();
                const receivedRemotely = query.data.items;

                receivedRemotely.forEach(async (remoteCv) => {
                    const same = local.find((localCv) => localCv.id === remoteCv.id);
                    if (same) {
                        const isNewer = dayjs(remoteCv.creationDate).isAfter(same.creationDate);
                        if (isNewer) {
                            await db.cv
                                .update(same.id, remoteCv)
                                .then(() => (updated = true))
                                .catch(() => {});
                        }
                    } else {
                        await db.cv
                            .add(remoteCv)
                            .then(() => (updated = true))
                            .catch(() => {});
                    }
                });

                const merged = (await db.cv.toArray()).sort((a, b) => {
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
