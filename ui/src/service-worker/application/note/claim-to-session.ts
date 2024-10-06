import { LocalDB } from '~/service-worker/infrastructure/db/mod.db';
import { swMessageChannel } from '~/service-worker/infrastructure/message-channel/mod.message-channel';
import { authService } from '~/service-worker/services/auth.service';

import { NETWORK_MESSAGES } from 'core/src/infrastructure/networking/channel-messaging';

import { cloudApi } from './cloud.api';

export async function claimNotesToSession() {
  const db = await LocalDB.getConnection();

  const session = await authService.getSession();
  if (!session?.current) return;

  try {
    const docs = await db.note.toArray();
    if (docs?.length) {
      const unclaimed = docs.filter(({ userId }) => !userId);

      for (const doc of unclaimed) {
        const created = await cloudApi.create({
          payload: {
            ...doc,
            userId: session.current.id,
          },
        });

        if (created.data?.ok) {
          db.note.update(doc.id, {
            userId: session.current.id,
          });
          swMessageChannel.post(NETWORK_MESSAGES.SAVED_TO_CLOUD);
        }
      }
    }
  } catch {}
}
