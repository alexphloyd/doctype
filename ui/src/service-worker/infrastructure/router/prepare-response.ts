export function prepareResponse(responseData: any): Response {
    return new Response(JSON.stringify(responseData), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export function prepareErrorResponse<D>(errorMessage: D): Response {
    return new Response(JSON.stringify({ ok: false, message: errorMessage }), {
        headers: {
            'Content-Type': 'application/json',
        },
        status: 409,
        statusText: 'ServiceWorkerError',
    });
}
