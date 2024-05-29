import { type Cv } from 'core/src/domain/cv/types';

import { apiClient } from '~/shared/api-client/mod.api-client';

export const api = {
    async create({ data }: { data: OmitStrict<Cv, 'creationDate' | 'id'> }) {
        return apiClient.query<{ ok: boolean; createCvId: string }>({
            url: 'cv/create',
            method: 'POST',
            data,
        });
    },

    async getLocallyStored() {
        return apiClient.query<{ list: Cv[] }>({
            url: 'cv/getLocallyStored',
            method: 'GET',
        });
    },
};
