import { type Cv } from 'core/src/domain/cv/types';
import { MainDB } from '~/service-worker/infrastructure/db/mod.db';
import { authService } from '~/service-worker/infrastructure/services/auth.service';

export async function claimUnattachedCvsWithUserId() {
    const failedClaims = [] as Array<{ cvId: Cv['id'] }>;

    try {
        const session = await authService.getSession();
        if (session?.current.id) {
            const db = await MainDB.getConnection();

            const cvs = await db.cv.toArray();
            if (cvs?.length) {
                const unclaimed = cvs.filter(({ userId }) => !userId);

                unclaimed.forEach(async (cv) => {
                    await db.cv
                        .update(cv.id, {
                            userId: session.current.id,
                        })
                        .catch(() => {
                            failedClaims.push({ cvId: cv.id });
                        });
                });
            }
        }

        return {
            failedClaims,
        };
    } catch {}
}
