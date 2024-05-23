import { notifications } from '@mantine/notifications';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { z } from 'zod';

import { api } from '../../api/main';
import { actions } from '../model';
import { VerificationSchema } from '../schemas';

export const verify = createAsyncThunk<
    void,
    z.infer<typeof VerificationSchema>,
    { rejectValue: ApiErrorData | undefined }
>('auth/verify', async (args, { getState, rejectWithValue, dispatch }) => {
    const processCredentials = (getState() as AppState).auth.processes.signIn.credentials;

    const query = await api.verify({
        data: { code: args.code, email: processCredentials?.email ?? '' },
    });

    if (query.data) {
        notifications.show({
            title: 'Account Created',
            message: 'Please the use login tab to continue',
            autoClose: 5000,
        });

        dispatch(actions.changeSignInProcessTab('log-in'));
        dispatch(actions.changeSignInProcessStep('credentials'));
    } else {
        return rejectWithValue(query.error?.data);
    }
});
