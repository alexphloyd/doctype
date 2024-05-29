import { MainDB } from '../db/mod.db';

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
    const _handle = handlers_map.get(ev.request.url)!;
    return _handle(ev, await MainDB.getConnection());
}

export const router = {
    serve,
    register,
    has,
};

type RouteHandler = (ev: FetchEvent, db: MainDB) => Promise<Response>;
type RoutePath = string;
