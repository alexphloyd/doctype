import { NETWORK_MESSAGES } from 'core/src/infrastructure/networking/channel-messaging';

window.addEventListener('online', () => {
  navigator.serviceWorker.controller?.postMessage(NETWORK_MESSAGES.ONLINE);
});
