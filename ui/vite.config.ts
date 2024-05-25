/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { qrcode } from 'vite-plugin-qrcode';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tsconfigPaths(), qrcode()],
    base: './',
    root: './',

    build: {
        rollupOptions: {
            input: {
                sw: resolve(__dirname, '/src/service-worker/main.ts'),
                main: resolve(__dirname, 'index.html'),
                zod: 'zod',
                dayjs: 'dayjs',
                axios: 'axios',
            },

            output: {
                entryFileNames: (file) => {
                    switch (file.name) {
                        case 'sw':
                            return `assets/[name].js`;
                        default:
                            return `assets/[name]-[hash].js`;
                    }
                },
            },

            plugins: [
                {
                    name: 'sw-precache-assets',
                    async closeBundle() {
                        const manifest = JSON.parse(
                            await readFile(
                                resolve(__dirname, 'dist/.vite/manifest.json'),
                                'utf-8'
                            )
                        ) as any;
                        const originEnv = await readFile(
                            resolve(__dirname, '.env.origin'),
                            'utf-8'
                        );

                        const swChunk = manifest['src/service-worker/main.ts']?.file ?? '';
                        const chunkUrls = [] as string[];
                        Object.values(manifest).forEach((chunk: any) => {
                            if (
                                chunk.name === 'zod' ||
                                chunk.name === 'dayjs' ||
                                chunk.name === 'axios' ||
                                chunk.name === 'messages'
                            ) {
                                chunkUrls.push('/' + (chunk as any).file);
                            }

                            if (chunk.name === 'main') {
                                chunkUrls.push('/' + chunk.file);
                                chunkUrls.push('/' + chunk.css[0]);
                                chunkUrls.push('/' + chunk.assets[0]);
                            }
                        });

                        const insert = `VITE_ASSETS=${chunkUrls.join(' ')}\n\nVITE_SW_ASSET=/${swChunk}\n\n${originEnv}`;

                        await writeFile(resolve(__dirname, '.env'), insert, 'utf-8');

                        console.log('Generated .env');
                        console.log(insert);
                    },
                },
            ],
        },

        manifest: true,
    },

    server: {
        port: 3000,
        host: true,
        headers: {
            'Service-Worker-Allowed': '/',
        },
    },

    preview: {
        port: 3000,
        host: true,
    },

    resolve: {
        alias: {
            '.prisma/client/index-browser': '../node_modules/.prisma/client/index-browser.js',
        },
    },

    test: {
        globals: true,
        reporters: ['verbose'],
        cache: {
            dir: '../../node_modules/.vitest',
        },

        environment: 'jsdom',
        environmentOptions: {
            jsdom: {
                resources: 'usable',
            },
        },

        server: {
            deps: {
                inline: ['vitest-canvas-mock'],
            },
        },

        include: [
            'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
            '__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
        ],

        setupFiles: ['__tests__/setup.js'],
    },
});
