import { precacheAndRoute } from 'workbox-precaching';

/* serve precaching only for production */
export function precacheAndServeAssets() {
  if (import.meta.env.DEV) return;

  const assets: Array<{ url: string; revision: string | null }> = [
    { url: '/', revision: '1' },
    { url: '/icons/primary.svg', revision: '1' },
    { url: '/fonts/roboto.woff2', revision: '1' },
    { url: '/images/favicon.ico', revision: '1' },
    { url: '/images/favicon-32x32.png', revision: '1' },
    { url: '/images/favicon-16x16.png', revision: '1' },
    { url: '/images/apple-touch-icon.png', revision: '1' },
    { url: '/avatar-placeholder.png', revision: '1' },
  ];

  const dynamicAssets = import.meta.env.VITE_ASSETS;
  dynamicAssets?.split(' ').map((url: string) => {
    assets.push({ url, revision: null });
  });

  precacheAndRoute(assets);
}
