import { CvDto } from 'core/src/domain/cv/validation';
import { generateId } from 'core/src/infrastructure/lib/generate-id';
import dayjs from 'dayjs';
import { networkScheduler } from '~/service-worker/infrastructure/network-scheduler/mod.network-scheduler';
import { router } from '~/service-worker/infrastructure/router/mod.router';
import { prepareResponse } from '~/service-worker/infrastructure/router/prepare-response';

export function registerCvRoutes() {
    router.register({
        path: 'cv/create',
        handler: async (ev, db) => {
            const body = await ev.request.json();
            const parsedPayload = CvDto.pick({ title: true, userId: true }).parse(body);

            const data = {
                ...parsedPayload,
                id: generateId(),
                creationDate: dayjs().toString(),
            };

            const createdCvId = await db.cv.add(data);

            const res = {
                ok: Boolean(createdCvId),
                createdCvId,
            };

            networkScheduler.post({ req: ev.request, payload: parsedPayload });

            return prepareResponse(res);
        },
    });

    router.register({
        path: 'cv/getMany',
        handler: async (_ev, db) => {
            const cvs = (await db.cv.toArray()).sort((a, b) => {
                return dayjs(b.creationDate).diff(dayjs(a.creationDate));
            });

            const res = {
                ok: Boolean(cvs),
                list: cvs,
            };

            return prepareResponse(res);
        },
    });
}
