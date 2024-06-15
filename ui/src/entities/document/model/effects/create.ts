import { notifications } from '@mantine/notifications';
import { createAsyncThunk } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

import { api } from '../../api/mod.api';
import { getLocallyStored } from './get-locally-stored';

export const create = createAsyncThunk<
    any,
    void,
    { rejectValue: Partial<ApiErrorData> | undefined }
>('document/create', async (_, { dispatch, rejectWithValue }) => {
    const query = await api.create({
        data: {
            name: 'Document' + '-' + dayjs().format('ss').toString(),
        },
    });

    if (query.data?.ok) {
        dispatch(getLocallyStored());
        return query.data;
    } else {
        notifications.show({
            title: 'Failed',
            message: 'Oops, document is not created.',
            color: 'red',
            autoClose: 6000,
        });
        return rejectWithValue(query.error?.response?.data);
    }
});
