import { type AxiosHeaders } from 'axios';

import { type AnyPayload } from '../api-client/types';

export function parseRequestInstance(req: Request, payload?: AnyPayload) {
    const headers = Object.fromEntries(req.headers.entries());
    const parsedReq = JSON.parse(
        JSON.stringify(req, [
            'bodyUsed',
            'cache',
            'credentials',
            'destination',
            'integrity',
            'isHistoryNavigation',
            'keepalive',
            'method',
            'mode',
            'redirect',
            'referrer',
            'referrerPolicy',
            'signal',
            'url',
        ])
    );

    return { ...parsedReq, headers, payload };
}

export type ParsedRequest = Omit<
    Request,
    'arrayBuffer' | 'clone' | 'json' | 'blob' | 'text' | 'body' | 'headers'
> & {
    headers: AxiosHeaders;
    payload?: AnyPayload;
};
