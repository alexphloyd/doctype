import axios, { AxiosError, AxiosResponse, type AxiosRequestConfig } from 'axios';
import { type Tokens } from 'core/src/domain/auth/types';

import { ParsedRequest } from '../lib/request.parser';
import { authService } from '../services/auth.service';
import fetchAdapter from './fetch.adapter';

const REFRESH_TOKENS_API_PATH = 'auth/refresh';

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: false,

    /* use Fetch Adapter for SW environment */
    adapter: fetchAdapter,
});

instance.interceptors.request.use(async (config) => {
    config.headers['Content-Type'] = 'application/json';

    const tokens = await authService.getTokens();

    if (tokens?.access) {
        config.headers.Authorization = `Bearer ${tokens.access}`;
    }

    return config;
});

export const swApiClient = {
    async query<R>({ parsedRequest: parsedRequest }: { parsedRequest: ParsedRequest }) {
        let _res: AxiosResponse<R> | undefined;
        let _error: AxiosError | undefined;

        async function executeQuery(override?: AxiosRequestConfig) {
            await instance
                .request<R>({ ...parsedRequest, data: parsedRequest.payload, ...override })
                .then((res) => (_res = res))
                .catch((err) => (_error = err));
        }

        await executeQuery();

        if (_error) {
            const originalRequest = _error.config;

            if (
                originalRequest &&
                _error.response &&
                [401, 403].includes(_error.response.status)
            ) {
                const storedTokens = await authService.getTokens();
                const updatedTokens = await instance
                    .request({
                        url: REFRESH_TOKENS_API_PATH,
                        method: 'GET',
                        headers: {
                            refresh: storedTokens?.refresh,
                        },
                    })
                    .then((res) => res.data as Tokens);

                if (updatedTokens) {
                    await authService.updateTokens(updatedTokens);
                    await executeQuery({
                        headers: {
                            Authorization: `Bearer ${updatedTokens.access}`,
                        },
                    });
                }
            }
        }

        return {
            data: _res?.data,
            error: _error,
        };
    },
};
