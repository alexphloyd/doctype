import axios, { type AxiosRequestConfig } from 'axios';

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
                .then((res) => (_res = { error: undefined, data: res.data }))
                .catch((err) => (_res = { data: undefined, error: err }));
        }

        await serviceWorkerState.activated;

        await executeQuery();

        return {
            data: _res.data,
            error: _res.error?.response,
            networkError: _res.error?.response ? undefined : _res.error,
        };
    },
};

export const UNEXPECTED_ERROR: ApiErrorData = {
    message: "Sorry, we've faced an unexpected error",
    statusCode: 500,
};
