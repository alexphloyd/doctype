import { MainDB } from '../db/main';
import { prepareErrorResponse } from './prepare-response';

const handlers_map = new Map<
    string /* path */,
    (ev: FetchEvent, db: MainDB) => Promise<Response>
>();

function has({ url }: { url: string }) {
    return handlers_map.has(url);
}

async function register({
    baseUrl = import.meta.env.VITE_BACKEND_URL,
    path,
    handler,
}: {
    baseUrl?: string;
    path: string;
    handler: (ev: FetchEvent, db: MainDB) => Promise<Response>;
}) {
    handlers_map.set(baseUrl + path, handler);
}

async function serve(ev: FetchEvent) {
    if (handlers_map.get(ev.request.url)) {
        const _handle = handlers_map.get(ev.request.url)!;
        return _handle(ev, await MainDB.getConnection());
    } else {
        return fetch(ev.request).catch((err: any) => {
            console.warn(err);
            return prepareErrorResponse('Oops! Something went wrong with this action.');
        });
    }
}

export const router = {
    serve,
    register,
    has,
};
