import { messageBuilder } from 'core/src/infrastructure/channel-messaging/messages';

import { defineSession } from './effects/define-session';

export function initiate(dispatch: Dispatch) {
    dispatch(defineSession());

    window.addEventListener('online', () => {
        navigator.serviceWorker.controller?.postMessage(
            messageBuilder.NETWORK_STATE_CHANGED('online')
        );
    });
}
