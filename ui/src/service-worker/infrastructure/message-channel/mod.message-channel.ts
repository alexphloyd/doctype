import { _self } from '../self';

export const messageChannel = {
  on: (message: string, handler: () => void) => {
    _self.addEventListener('message', (ev) => {
      if (ev.data === message) {
        handler();
      }
    });
  },
  post: (message: string) => {
    _self.clients.matchAll().then((all) => all.map((client) => client.postMessage(message)));
  },
};
