import { type Tokens } from 'core/src/domain/auth/types';

import { MainDB } from '../db/mod.db';
import { messageChannel } from '../message-channel/mod.message-channel';

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
        } catch {}
    },
    async getTokens() {
        const db = await MainDB.getConnection();
        return await db.authTokens.get('singleton');
    },
    async removeTokens() {
        const db = await MainDB.getConnection();
        try {
            await db.authTokens.delete('singleton');
        } catch {}
    },
};

messageChannel.on('LOGOUT', () => {
    authService.removeTokens();
});
