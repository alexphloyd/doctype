import { MainDB } from '~/service-worker/infrastructure/db/main';
import { _self } from '~/service-worker/infrastructure/self';

_self.addEventListener('message', async ({ data }) => {
    if (data.type === 'AUTH_TOKENS_UPDATED') {
        const { access, refresh } = data.info as any;

        if (access && refresh) {
            const db = await MainDB.getConnection();
            db.authTokens.update('singleton', { access, refresh });
        }
    }
});
