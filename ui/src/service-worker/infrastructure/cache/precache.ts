import { cleanupOutdatedCaches } from 'workbox-precaching/cleanupOutdatedCaches';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';

export function precacheAndServeAssets() {
  registerRoute(
    ({ request }) => request.destination === 'document' || request.mode === 'navigate',
    new NetworkFirst({
      cacheName: 'html',
    })
  );
  registerRoute(
    ({ request }) => {
      const isApplicationAsset =
        request.destination === 'script' && request.url.includes('assets');

      return (
        isApplicationAsset ||
        ['style', 'font', 'image'].includes(request.destination) ||
        request.url.endsWith('.svg') ||
        request.url.includes('manifest')
      );
    },
    new StaleWhileRevalidate({
      cacheName: 'assets',
    })
  );

  cleanupOutdatedCaches();
}
