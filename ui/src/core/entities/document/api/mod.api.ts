import { type Document } from 'core/src/domain/document/types';
import { apiClient } from '~/core/shared/api-client/mod.api-client';

export const api = {
  async create({ data }: { data: OmitStrict<Document, 'lastUpdatedTime' | 'id'> }) {
    return apiClient.query<{ ok: boolean }>({
      url: 'document/create',
      method: 'POST',
      data,
    });
  },

  async remove({ data }: { data: Pick<Document, 'id'> }) {
    return apiClient.query<{ ok: boolean }>({
      url: 'document/remove',
      method: 'POST',
      data,
    });
  },

  async rename({ data }: { data: Pick<Document, 'name' | 'id'> }) {
    return apiClient.query<{ ok: boolean }>({
      url: 'document/rename',
      method: 'POST',
      data,
    });
  },

  async getLocallyStored() {
    return apiClient.query<{ ok: boolean; items: Document[] }>({
      url: 'document/getLocallyStored',
      method: 'GET',
    });
  },

  async getWithRemotelyStored() {
    return apiClient.query<{ ok: boolean; items: Document[]; updated: boolean }>({
      url: 'document/getWithRemotelyStored',
      method: 'GET',
    });
  },
};
