import { createAsyncThunk } from '@reduxjs/toolkit';
import { type Cv } from 'core/src/domain/cv/types';

import { api } from '../../api/mod.api';

export const getWithRemotelyStored = createAsyncThunk<
    { ok: boolean; items: Cv[]; updated: boolean },
    void,
    { rejectValue: Partial<ApiErrorData> | undefined }
>('cv/getWithRemotelyStored', async (_, { getState, rejectWithValue }) => {
    const appState = getState() as AppState;
    if (!appState.auth.session) return rejectWithValue({ message: 'session is not defined' });
    const query = await api.getWithRemotelyStored();

    if (query.data) {
        return query.data;
    } else {
        return rejectWithValue(query.error?.data);
    }
});
