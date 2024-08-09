import { createAsyncThunk } from '@reduxjs/toolkit';
import { type Document } from 'core/src/domain/document/types';

import { api } from '../../api/mod.api';

export const getWithRemotelyStored = createAsyncThunk<
    { ok: boolean; items: Document[]; updated: boolean },
    void,
    { rejectValue: Partial<ApiErrorData> | undefined }
>('document/getWithRemotelyStored', async (_, { getState, rejectWithValue }) => {
    const appState = getState() as AppState;
    if (!appState.auth.session) {
        return rejectWithValue({ message: 'session is not defined' });
    }

    const query = await api.getWithRemotelyStored();
    if (query.data) {
        return query.data;
    } else {
        return rejectWithValue(query.error?.response?.data);
    }
});
