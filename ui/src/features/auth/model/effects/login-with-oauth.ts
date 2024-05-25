import { notifications } from '@mantine/notifications';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { router } from '~/app/router/mod.router';

import { api } from '../../api/mod.api';
import { actions } from '../model';

export const loginWithOAuth = createAsyncThunk<
    void,
    { oauthToken: string | undefined; type: string },
    { rejectValue: ApiErrorData | undefined }
>('auth/login-with-oauth', async (args, { dispatch, rejectWithValue }) => {
    const preparedToken = `${args.type} ${args.oauthToken}`;
    const query = await api.loginWithOAuth({ oauthToken: preparedToken });

    if (query.data) {
        const { user } = query.data;
        dispatch(actions.registerSession(user));
        router.navigate('/');
    } else {
        notifications.show({
            title: 'OAuth Sign-In Failed',
            message: 'Unfortunately, we cannot proceed with the sign-in now',
            color: 'red',
        });
        return rejectWithValue(query.error?.data);
    }
});
