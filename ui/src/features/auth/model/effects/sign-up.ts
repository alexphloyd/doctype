import { createAsyncThunk } from '@reduxjs/toolkit';
import { SignUpDto } from 'core/src/domain/auth/validation';
import { z } from 'zod';

import { api } from '../../api/mod.api';
import { actions } from '../model';

export const signUp = createAsyncThunk<
    void,
    z.infer<typeof SignUpDto>,
    { rejectValue: Partial<ApiErrorData> | undefined }
>('auth/sign-up', async (args, { dispatch, rejectWithValue }) => {
    const query = await api.signUp({ data: args });

    if (query?.data) {
        dispatch(actions.updateSignInProcessCredentials(query.data.createdUser));
        dispatch(actions.changeSignInProcessStep('verification'));
    } else {
        return rejectWithValue(query.error?.response?.data);
    }
});
