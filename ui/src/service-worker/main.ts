import { registerAuthRoutes } from './application/auth/routes';
import { registerDocumentRoutes } from './application/document/routes';
import { precacheAndServeAssets } from './infrastructure/cache/precache';
import { router } from './infrastructure/router/mod.router';
import { _self } from './infrastructure/self';

precacheAndServeAssets();

registerDocumentRoutes();
registerAuthRoutes();

_self.addEventListener('activate', (event) => {
  event.waitUntil(_self.clients.claim());
});

_self.addEventListener('fetch', (event) => {
  if (router.has({ url: event.request.url })) {
    event.respondWith(router.serve(event));
  }
});
