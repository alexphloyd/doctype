import { CvDto } from 'core/src/domain/cv/validation';
import { generateId } from 'core/src/infrastructure/lib/generate-id';
import dayjs from 'dayjs';
import { networkScheduler } from '~/service-worker/infrastructure/network-scheduler/mod.network-scheduler';
import { router } from '~/service-worker/infrastructure/router/mod.router';
import { prepareResponse } from '~/service-worker/infrastructure/router/prepare-response';
import { authService } from '~/service-worker/infrastructure/services/auth.service';

export function registerCvRoutes() {
    router.register({
        path: 'cv/create',
        handler: async (ev, db) => {
            const body = await ev.request.json();
            const parsedPayload = CvDto.pick({ title: true }).parse(body);

            const session = await authService.getSession();

            const createdCvId = await db.cv.add({
                ...parsedPayload,

                id: generateId(),
                creationDate: dayjs().toString(),
                userId: session?.current.id,
            });

            if (session) {
                networkScheduler.post({ req: ev.request, payload: parsedPayload });
            }

            return prepareResponse({
                ok: Boolean(createdCvId),
                createdCvId,
            });
        },
    });

    router.register({
        path: 'cv/getLocallyStored',
        handler: async (_ev, db) => {
            const cvs = (await db.cv.toArray()).sort((a, b) => {
                return dayjs(b.creationDate).diff(dayjs(a.creationDate));
            });

            return prepareResponse({
                list: cvs,
            });
        },
    });
}
