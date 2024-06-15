import { createAsyncThunk } from '@reduxjs/toolkit';
import { HttpStatusCode } from 'axios';
import { LoginDto } from 'core/src/domain/auth/validation';
import { z } from 'zod';

import { router } from '~/app/router/mod.router';

import { api } from '../../api/mod.api';
import { actions } from '../model';

export const login = createAsyncThunk<
    void,
    z.infer<typeof LoginDto>,
    { rejectValue: Partial<ApiErrorData> | undefined }
>('auth/login', async (args, { dispatch, rejectWithValue }) => {
    const query = await api.login({ data: args });
    const { error, data } = query;

    const errorCode = error?.status;

    const isVerificationNeeded = errorCode === HttpStatusCode.UpgradeRequired;
    const isSessionDefined = !!data?.user;

    if (isSessionDefined) {
        dispatch(actions.registerSession(data.user));
    }

    if (isSessionDefined && !isVerificationNeeded) {
        router.navigate('/');
    }

    if (isVerificationNeeded) {
        dispatch(actions.updateSignInProcessCredentials({ email: args.email }));
        dispatch(actions.changeSignInProcessStep('verification'));
        dispatch(actions.changeSignInProcessTab('sign-up'));
    }

    if (!isVerificationNeeded && error) {
        return rejectWithValue(error?.response?.data);
    }
});
