import { type Document } from 'core/src/domain/document/types';
import { NETWORK_MESSAGES } from 'core/src/infrastructure/networking/channel-messaging';
import { LocalDB } from '~/service-worker/infrastructure/db/mod.db';
import { messageChannel } from '~/service-worker/infrastructure/message-channel/mod.message-channel';

import { cloudApi } from './cloud.api';
import { authService } from '~/service-worker/services/auth.service';

export async function claimDocsToSession() {
  const failedClaims = [] as Array<{ docId: Document['id'] }>;

  try {
    const session = await authService.getSession();
    if (session?.current.id) {
      const db = await LocalDB.getConnection();

      const docs = await db.document.toArray();
      if (docs?.length) {
        const unclaimed = docs.filter(({ userId }) => !userId);

        for (const doc of unclaimed) {
          await db.document
            .update(doc.id, {
              userId: session.current.id,
            })
            .catch(() => {
              failedClaims.push({
                docId: doc.id,
              });
            });

          await cloudApi
            .create({
              payload: {
                ...doc,
                userId: session.current.id,
              },
            })
            .then((res) => {
              if (res?.data?.ok) {
                messageChannel.post(NETWORK_MESSAGES.SAVED_TO_CLOUD);
              }
            });
        }
      }
    }

    return {
      failedClaims,
    };
  } catch {}
}
