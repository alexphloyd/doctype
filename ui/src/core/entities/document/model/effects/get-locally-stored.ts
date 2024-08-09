import { createAsyncThunk } from '@reduxjs/toolkit';
import { type Document } from 'core/src/domain/document/types';

import { api } from '../../api/mod.api';

export const getLocallyStored = createAsyncThunk<
    { ok: boolean; items: Document[] },
    void,
    { rejectValue: Partial<ApiErrorData> | undefined }
>('document/getLocallyStored', async (_, { rejectWithValue }) => {
    const query = await api.getLocallyStored();

    if (query.data) {
        return query.data;
    } else {
        return rejectWithValue(query.error?.response?.data);
    }
});
