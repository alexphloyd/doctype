import { notifications } from '@mantine/notifications';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { type Document } from 'core/src/domain/document/types';

import { api } from '../../api/mod.api';
import { getLocallyStored } from './get-locally-stored';

export const remove = createAsyncThunk<
  any,
  { id: Document['id'] },
  { rejectValue: Partial<ApiErrorData> | undefined }
>('document/remove', async (args, { dispatch, rejectWithValue }) => {
  const query = await api.remove({
    data: {
      id: args.id,
    },
  });

  if (query.data?.ok) {
    dispatch(getLocallyStored());
    return query.data;
  } else {
    notifications.show({
      title: 'Failed',
      message: 'Oops, document is not removed.',
      color: 'red',
      autoClose: 6000,
    });
    return rejectWithValue(query.error?.response?.data);
  }
});
