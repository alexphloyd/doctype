import { MainDB } from '../db/mod.db';
import { UNEXPECTED_ERROR_MESSAGE } from '../lib/error-message';
import { prepareErrorResponse } from './prepare-response';

const handlers_map = new Map<RoutePath, RouteHandler>();

function has({ url }: { url: RoutePath }) {
    return handlers_map.has(url);
}

async function register({
    baseUrl = import.meta.env.VITE_BACKEND_URL,
    path,
    handler,
}: {
    baseUrl?: string;
    path: RoutePath;
    handler: RouteHandler;
}) {
    handlers_map.set(baseUrl + path, handler);
}

async function serve(ev: FetchEvent) {
    if (has({ url: ev.request.url })) {
        const _handle = handlers_map.get(ev.request.url)!;

        try {
            return _handle(ev, await MainDB.getConnection());
        } catch (err: any) {
            return prepareErrorResponse(UNEXPECTED_ERROR_MESSAGE);
        }
    } else {
        try {
            return await fetch(ev.request.clone());
        } catch (err) {
            return prepareErrorResponse(UNEXPECTED_ERROR_MESSAGE);
        }
    }
}

export const router = {
    serve,
    register,
    has,
};

type RouteHandler = (ev: FetchEvent, db: MainDB) => Promise<Response>;
type RoutePath = string;
