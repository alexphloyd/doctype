/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_ASSETS: string;

    VITE_SW_ASSET: string;

    VITE_APP_URL: string;

    VITE_BACKEND_URL: string;

    VITE_GOOGLE_CLIENT_ID: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
