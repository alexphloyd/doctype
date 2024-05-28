import { User } from '@prisma/client';
import { AUTH_MESSAGES } from 'core/src/domain/auth/channel-messaging';
import { type Tokens } from 'core/src/domain/auth/types';
import { claimUnattachedCvsWithUserId } from '~/service-worker/domain/cv/model';

import { MainDB } from '../db/mod.db';
import { messageChannel } from '../message-channel/mod.message-channel';
import { networkScheduler } from '../network-scheduler/mod.network-scheduler';

export const authService = {
    async updateTokens({ access, refresh }: Tokens) {
        const db = await MainDB.getConnection();

        try {
            const singleton = await db.authTokens.get('singleton');

            if (!singleton) {
                await db.authTokens.add({ id: 'singleton', access, refresh });
            } else {
                await db.authTokens.update('singleton', {
                    access,
                    refresh,
                });
            }

            networkScheduler.execute();
        } catch {}
    },
    async getTokens() {
        const db = await MainDB.getConnection();
        return await db.authTokens.get('singleton').catch(() => undefined);
    },
    async removeTokens() {
        const db = await MainDB.getConnection();
        await db.authTokens.delete('singleton').catch(() => {});
    },

    async updateSession({ user }: { user: User }) {
        const db = await MainDB.getConnection();

        try {
            const singleton = await db.session.get('singleton');

            if (!singleton) {
                await db.session.add({ id: 'singleton', current: user });
            } else {
                await db.session.update('singleton', {
                    current: user,
                });
            }

            claimUnattachedCvsWithUserId();
        } catch {}
    },
    async getSession() {
        const db = await MainDB.getConnection();
        return await db.session.get('singleton').catch(() => undefined);
    },
    async removeSession() {
        const db = await MainDB.getConnection();
        return await db.session.delete('singleton').catch(() => {});
    },
};

messageChannel.on(AUTH_MESSAGES.LOGOUT, () => {
    authService.removeTokens();
    authService.removeSession();
});
