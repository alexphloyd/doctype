import { notifications } from '@mantine/notifications';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '../../api/mod.api';
import { getLocallyStored } from './get-locally-stored';

export const create = createAsyncThunk<
    any,
    void,
    { rejectValue: Partial<ApiErrorData> | undefined }
>('cv/create', async (_, { dispatch, rejectWithValue }) => {
    const query = await api.create({
        data: { title: 'Drafted CV', userId: undefined },
    });

    if (query.data?.ok) {
        dispatch(getLocallyStored());
        return query.data;
    } else {
        notifications.show({
            title: 'Failed',
            message: 'Oops, cv is not created.',
            color: 'red',
            autoClose: 3000,
        });
        return rejectWithValue(query.error?.data);
    }
});
