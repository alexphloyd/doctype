import axios, { AxiosError, type AxiosRequestConfig } from 'axios';

import { serviceWorkerState } from '~/app/store/service-worker.state';

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

export const apiClient = {
    async query<R>(config: AxiosRequestConfig) {
        let _res: ApiClientResponse<R> = {
            data: undefined,
            error: undefined,
        };

        async function executeQuery() {
            await instance
                .request<R>(config)
                .then((res: any) => {
                    _res = { error: undefined, data: res.data };
                })
                .catch((err: AxiosError<ApiErrorData, any>) => {
                    const code = err?.response?.data?.statusCode ?? 503;
                    const _err = code >= 200 && code < 500 ? err : UNEXPECTED_ERROR;

                    _res = { data: undefined, error: _err };
                });
        }

        await serviceWorkerState.activated;
        await executeQuery().catch(() => {});

        return {
            data: _res.data,
            error: _res.error,
        };
    },
};

const UNEXPECTED_ERROR: AxiosError<ApiErrorData, any> | undefined = {
    response: {
        data: {
            message: "Oops! It seems we've hit a bump in the road..",
            statusCode: 503,
        },
        status: 503,
        statusText: 'UNEXPECTED',
    } as any,
    isAxiosError: true,
    name: 'UNEXPECTED',
    code: '503',
    toJSON: () => ({}),
    message: "Oops! It seems we've hit a bump in the road..",
};
