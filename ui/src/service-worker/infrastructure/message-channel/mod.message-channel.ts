import { MESSAGES, type MessageInfo } from 'core/src/infrastructure/channel-messaging/messages';

import { _self } from '../self';

export const messageChannel = {
    on: <T extends keyof typeof MESSAGES>(
        message: T,
        handler: (info: MessageInfo<T>) => void
    ) => {
        _self.addEventListener('message', ({ data }) => {
            if (data.type === message) {
                handler(data.info);
            }
        });
    },
};
