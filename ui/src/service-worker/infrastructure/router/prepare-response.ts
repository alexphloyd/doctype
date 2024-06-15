import { type AxiosError } from 'axios';

export function prepareResponse(responseData: any): Response {
    return new Response(JSON.stringify(responseData), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export function prepareErrorResponse(error?: Partial<AxiosError>): Response {
    const errorData = JSON.stringify(error?.response?.data) || null;
    const headers = new Headers((error?.response?.headers as any) ?? {});

    return new Response(errorData, {
        status: error?.response?.status ?? 503,
        statusText: error?.response?.statusText,
        headers,
    });
}
