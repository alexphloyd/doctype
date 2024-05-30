import { type Cv } from 'core/src/domain/cv/types';
import { NETWORK_MESSAGES } from 'core/src/infrastructure/networking/channel-messaging';
import { MainDB } from '~/service-worker/infrastructure/db/mod.db';
import { messageChannel } from '~/service-worker/infrastructure/message-channel/mod.message-channel';
import { authService } from '~/service-worker/infrastructure/services/auth.service';

import { couldApi } from './cloud.api';

export async function saveUnclaimedCvsToCloud() {
    const failedClaims = [] as Array<{ cvId: Cv['id'] }>;

    try {
        let updated = false;

        const session = await authService.getSession();
        if (session?.current.id) {
            const db = await MainDB.getConnection();

            const cvs = await db.cv.toArray();
            if (cvs?.length) {
                const unclaimed = cvs.filter(({ userId }) => !userId);

                for (const cv of unclaimed) {
                    await db.cv
                        .update(cv.id, {
                            userId: session.current.id,
                        })
                        .catch(() => {
                            failedClaims.push({ cvId: cv.id });
                        });

                    await couldApi
                        .create({
                            payload: {
                                ...cv,
                                userId: session.current.id,
                            },
                        })
                        .then((saveToCloudResponse) => {
                            if (saveToCloudResponse?.data?.ok) {
                                updated = true;
                            }
                        });
                }
            }
        }

        if (updated) {
            messageChannel.post(NETWORK_MESSAGES.SAVED_TO_CLOUD);
        }

        return {
            failedClaims,
        };
    } catch {}
}
