import { _self } from '../self';

export const messageChannel = {
    on: (message: string, handler: () => void) => {
        _self.addEventListener('message', (ev) => {
            if (ev.data === message) {
                handler();
            }
        });
    },
};
