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
        await executeQuery().catch(() => {});

        return {
            data: _res.data,
            error: _res.error?.code === 'ERR_NETWORK' ? NETWORK_ERROR : _res.error?.response,
        };
    },
};

const NETWORK_ERROR = {
    data: {
        message: 'Network is required for this action',
    },
    status: 'ERR_NETWORK',
};
