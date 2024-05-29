import { notifications } from '@mantine/notifications';
import { createSlice } from '@reduxjs/toolkit';
import { NETWORK_MESSAGES } from 'core/src/infrastructure/networking/channel-messaging';

import { create } from './effects/create';
import { getLocallyStored } from './effects/get-locally-stored';
import { initialState } from './initial-state';

export const cvModel = createSlice({
    name: 'cv',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getLocallyStored.pending, (state, { meta }) => {
            state.effects.getLocallyStored.status = meta.requestStatus;
        });
        builder.addCase(getLocallyStored.fulfilled, (state, { payload, meta }) => {
            state.list = payload.items;
            state.effects.getLocallyStored.status = meta.requestStatus;
            state.effects.getLocallyStored.error = undefined;

            state.effects.getLocallyStored.firstExecution = false;
        });
        builder.addCase(getLocallyStored.rejected, (state, { payload, meta }) => {
            state.effects.getLocallyStored.status = meta.requestStatus;
            state.effects.getLocallyStored.error = payload;

            state.effects.getLocallyStored.firstExecution = false;
        });

        builder.addCase(create.pending, (state, { meta }) => {
            state.effects.create.status = meta.requestStatus;
        });
        builder.addCase(create.fulfilled, (state, { meta }) => {
            state.effects.create.status = meta.requestStatus;
            state.effects.create.error = undefined;
        });
        builder.addCase(create.rejected, (state, { payload, meta }) => {
            state.effects.create.status = meta.requestStatus;
            state.effects.create.error = payload;
        });
    },
});

navigator.serviceWorker.addEventListener('message', (ev) => {
    if (ev.data === NETWORK_MESSAGES.CLOUD_STORAGE_SYNCED) {
        notifications.show({
            title: 'Cloud Storage',
            message: 'Your progress successfully saved to cloud.',
            color: 'lime',
        });
    }
});

export const actions = cvModel.actions;
