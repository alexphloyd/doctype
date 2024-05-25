import { notifications } from '@mantine/notifications';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '../../api/mod.api';
import { getMany } from './get-many';

export const create = createAsyncThunk<any, void, { rejectValue: ApiErrorData | undefined }>(
    'cv/create',
    async (_, { dispatch, rejectWithValue }) => {
        const createOneQuery = await api.create({
            data: { title: 'Drafted CV', userId: undefined },
        });

        if (createOneQuery.data) {
            dispatch(getMany());
            return createOneQuery.data;
        } else {
            notifications.show({
                title: 'Failed',
                message: 'Sorry, document is not created.',
                color: 'red',
                autoClose: 3000,
            });
            return rejectWithValue(createOneQuery.error?.data);
        }
    }
);
