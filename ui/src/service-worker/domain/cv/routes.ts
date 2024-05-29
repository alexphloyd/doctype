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

import { couldApi } from './cloud.api';

export function registerCvRoutes() {
    router.register({
        path: 'cv/create',
        handler: async (ev, db) => {
            const body = await ev.request.json();
            const parsedPayload = CvSchema.pick({ title: true }).parse(body);

            const session = await authService.getSession();

            const created = await db.cv.add({
                ...parsedPayload,

                id: generateId(),
                creationDate: dayjs().toString(),
                userId: session?.current.id,
            });

            if (session) {
                networkScheduler.post({ req: ev.request, payload: parsedPayload });
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
                    return dayjs(b.creationDate).diff(dayjs(a.creationDate));
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
        path: 'cv/getRemotelyStored',
        handler: async () => {
            const query = await couldApi.getRemotelyStored();

            console.log(query, 'cvs in cloud query');

            return prepareResponse({
                ok: query.data?.ok,
                items: query.data?.items,
            });
        },
    });
}
