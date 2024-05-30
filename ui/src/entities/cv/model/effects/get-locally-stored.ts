import { createAsyncThunk } from '@reduxjs/toolkit';
import { type Cv } from 'core/src/domain/cv/types';

import { api } from '../../api/mod.api';

export const getLocallyStored = createAsyncThunk<
    { ok: boolean; items: Cv[] },
    void,
    { rejectValue: Partial<ApiErrorData> | undefined }
>('cv/getLocallyStored', async (_, { rejectWithValue }) => {
    const query = await api.getLocallyStored();

    if (query.data) {
        return query.data;
    } else {
        return rejectWithValue(query.error?.data);
    }
});
