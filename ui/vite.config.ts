/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { compression } from 'vite-plugin-compression2';
import { qrcode } from 'vite-plugin-qrcode';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths(), qrcode(), compression()],
  base: './',
  root: './',

  build: {
    rollupOptions: {
      input: {
        sw: resolve(__dirname, '/src/service-worker/main.ts'),
        app: resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks: {
          libs: ['zod', 'dayjs', 'axios'],
          'core-package': ['core'],
        },
        entryFileNames: (file) => {
          switch (file.name) {
            case 'sw':
              return `assets/[name].js`;
            case 'index':
              return `assets/app-[hash].js`;
            default:
              return `assets/[name]-[hash].js`;
          }
        },
      },
    },
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
