import axios, { type AxiosRequestConfig } from 'axios';

import { serviceWorkerState } from '~/app/store/service-worker.state';

import { tokensService } from '~/features/auth/model/services/tokens.service';

const REFRESH_TOKENS_API_PATH = 'auth/refresh';

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

instance.interceptors.request.use(
    (config) => {
        config.headers['Content-Type'] = 'application/json';

        const access = tokensService.getAccess();
        const refresh = tokensService.getRefresh();

        if (access && refresh) {
            config.headers.Authorization = `Bearer ${access}`;
            config.headers.refresh = refresh;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const apiClient = {
    getDefaults() {
        return instance.defaults;
    },
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

        if (_res.error) {
            const originalRequest = _res.error.config;

            if (
                originalRequest &&
                _res.error.response &&
                [401, 403].includes(_res.error.response.status)
            ) {
                const tokens = await instance
                    .request({
                        url: REFRESH_TOKENS_API_PATH,
                        method: 'GET',
                        headers: {
                            refresh: tokensService.getRefresh(),
                        },
                    })
                    .then((res) => res.data)
                    .catch(null);

                if (tokens) {
                    tokensService.set(tokens);
                    await executeQuery();
                }
            }
        }

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
