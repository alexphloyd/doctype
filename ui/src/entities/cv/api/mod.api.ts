import { type Cv } from 'core/src/domain/cv/types';

import { apiClient } from '~/shared/api-client/mod.api-client';

export const api = {
    async create({ data }: { data: OmitStrict<Cv, 'creationDate' | 'id'> }) {
        return apiClient.query<{ ok: boolean }>({
            url: 'cv/create',
            method: 'POST',
            data,
        });
    },

    async getLocallyStored() {
        return apiClient.query<{ ok: boolean; items: Cv[] }>({
            url: 'cv/getLocallyStored',
            method: 'GET',
        });
    },

    async getRemotelyStored() {
        return apiClient.query<{ ok: boolean; items: Cv[] }>({
            url: 'cv/getRemotelyStored',
            method: 'GET',
        });
    },
};
