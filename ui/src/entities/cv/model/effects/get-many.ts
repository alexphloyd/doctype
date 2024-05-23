import { createAsyncThunk } from '@reduxjs/toolkit';
import { type Cv } from 'core/src/domain/cv/types/main';

import { api } from '../../api/main';

export const getMany = createAsyncThunk<
    { ok: boolean; list: Cv[] },
    void,
    { rejectValue: ApiErrorData | undefined }
>('cv/get', async (_, { rejectWithValue }) => {
    const query = await api.getMany();

    if (query.data?.ok) {
        return query.data;
    } else {
        return rejectWithValue(query.error?.data);
    }
});
