import axios, { type AxiosRequestConfig } from 'axios';

import fetchAdapter from './fetch.adapter';

const REFRESH_TOKENS_API_PATH = 'auth/refresh';

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,

    /* use Fetch Adapter for SW environment */
    adapter: fetchAdapter,
});

instance.interceptors.request.use(
    (config) => {
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

export const swApiClient = {
    getDefaults() {
        return instance.defaults;
    },
    async query<R>(config: AxiosRequestConfig) {
        let _res: ApiClientResponse<R> = {
            data: undefined,
            error: undefined,
        };

        async function executeQuery(override?: AxiosRequestConfig) {
            await instance
                .request<R>({ ...config, ...override })
                .then((res) => (_res = { error: undefined, data: res.data }))
                .catch((err) => (_res = { data: undefined, error: err }));
        }

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
                            refresh: originalRequest.headers['refresh'],
                        },
                    })
                    .then((res) => res.data)
                    .catch(console.log);

                if (tokens) {
                    await executeQuery({
                        headers: {
                            Authorization: `Bearer ${tokens.access}`,
                            refresh: tokens.refresh,
                        },
                    });
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
