import { registerCvRoutes } from './domain/cv/routes';
import { precacheAndServeAssets } from './infrastructure/cache/precache';
import { router } from './infrastructure/router/main';
import { _self } from './infrastructure/self';

precacheAndServeAssets();

registerCvRoutes();

_self.addEventListener('activate', (event) => {
    event.waitUntil(_self.clients.claim());
});

_self.addEventListener('fetch', (event) => {
    if (router.has({ url: event.request.url })) {
        event.respondWith(router.serve(event));
    }
});
