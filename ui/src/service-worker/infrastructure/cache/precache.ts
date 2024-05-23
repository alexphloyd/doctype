import { precacheAndRoute } from 'workbox-precaching';

/* serve precaching only for production */
export function precacheAndServeAssets() {
    if (import.meta.env.DEV) return;

    const assets: Array<{ url: string; revision: string | null }> = [
        { url: '/', revision: '3' },
        { url: '/icons/primary.svg', revision: '3' },
        { url: '/fonts/roboto.woff2', revision: '2' },
        { url: '/logo.png', revision: '2' },
        { url: '/images/favicon.ico', revision: '2' },
        { url: '/images/favicon-32x32.png', revision: '2' },
        { url: '/images/favicon-16x16.png', revision: '2' },
        { url: '/images/apple-touch-icon.png', revision: '2' },
        { url: '/avatar-placeholder.png', revision: '2' },
    ];

    const dynamicAssets = import.meta.env.VITE_ASSETS;
    dynamicAssets?.split(' ').map((url: string) => {
        assets.push({ url, revision: null });
    });

    precacheAndRoute(assets);
}
