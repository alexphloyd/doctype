import { notifications } from '@mantine/notifications';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '../../api/mod.api';
import { getLocallyStored } from './get-locally-stored';

export const applyRename = createAsyncThunk<
    any,
    void,
    { rejectValue: Partial<ApiErrorData> | undefined }
>('document/applyRename', async (_, { dispatch, rejectWithValue, getState }) => {
    const appState = getState() as AppState;
    const renamingProcess = appState.document.processes.renaming;

    if (renamingProcess) {
        if (renamingProcess.initial !== renamingProcess.input) {
            const renameQuery = await api.rename({
                data: {
                    id: renamingProcess?.docId,
                    name: renamingProcess?.input.length
                        ? renamingProcess?.input
                        : renamingProcess.initial,
                },
            });

            if (renameQuery.data?.ok) {
                await dispatch(getLocallyStored()).unwrap();
                return renameQuery.data;
            } else {
                notifications.show({
                    title: 'Failed',
                    message: 'Oops, document is not renamed.',
                    color: 'red',
                    autoClose: 6000,
                });
                return rejectWithValue(renameQuery.error?.response?.data);
            }
        }
    }
});
