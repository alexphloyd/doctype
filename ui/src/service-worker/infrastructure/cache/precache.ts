import { precacheAndRoute, type PrecacheEntry } from 'workbox-precaching';
import { cleanupOutdatedCaches } from 'workbox-precaching/cleanupOutdatedCaches';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';

export function precacheAndServeAssets() {
  const resources = [
    { url: '/icons/primary.svg', revision: 'v1' },
    { url: '/fonts/roboto.woff2', revision: 'v1' },
    { url: '/images/favicon.ico', revision: 'v1' },
    { url: '/images/favicon-32x32.png', revision: 'v1' },
    { url: '/images/favicon-16x16.png', revision: 'v1' },
    { url: '/images/apple-touch-icon.png', revision: 'v1' },
    { url: '/avatar-placeholder.png', revision: 'v1' },
  ] satisfies Array<PrecacheEntry>;

  const assets = import.meta.env.VITE_ASSETS?.split(' ').map((url: string) => {
    return { url, revision: null };
  }) satisfies Array<PrecacheEntry>;

  precacheAndRoute([...resources, ...assets]);

  registerRoute(
    ({ request }) => request.destination === 'script',
    new StaleWhileRevalidate({
      cacheName: 'assets',
    })
  );
  registerRoute(
    ({ request }) => request.destination === 'document' || request.mode === 'navigate',
    new NetworkFirst({
      cacheName: 'html',
    })
  );

  cleanupOutdatedCaches();
}
