import { notifications } from '@mantine/notifications';
import { createSlice } from '@reduxjs/toolkit';
import { NETWORK_MESSAGES } from 'core/src/infrastructure/networking/channel-messaging';

import { store } from '~/app/store/app-store';
import { on } from '~/app/store/middleware';

import { authModel } from '~/features/auth/model/model';

import { create } from './effects/create';
import { getLocallyStored } from './effects/get-locally-stored';
import { getWithRemotelyStored } from './effects/get-with-remotely-stored';
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

        builder.addCase(getWithRemotelyStored.pending, (state, { meta }) => {
            state.effects.getWithRemotelyStored.status = meta.requestStatus;
        });
        builder.addCase(getWithRemotelyStored.fulfilled, (state, { payload, meta }) => {
            if (payload.ok && payload.updated) {
                state.list = payload.items;
                notifications.show({
                    title: 'Cloud Storage',
                    message: `You've received few updates from cloud!`,
                    color: 'lime',
                    autoClose: 12000,
                });
            }

            state.effects.getWithRemotelyStored.status = meta.requestStatus;
            state.effects.getWithRemotelyStored.error = undefined;

            state.effects.getWithRemotelyStored.firstExecution = false;
        });
        builder.addCase(getWithRemotelyStored.rejected, (state, { payload, meta }) => {
            state.effects.getWithRemotelyStored.status = meta.requestStatus;
            state.effects.getWithRemotelyStored.error = payload;

            state.effects.getWithRemotelyStored.firstExecution = false;
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

on({
    actionCreator: authModel.actions.registerSession,
    effect({ payload: session }) {
        if (session.verified) {
            store.dispatch(getWithRemotelyStored());
        }
    },
});

navigator.serviceWorker.addEventListener('message', (ev) => {
    if (ev.data === NETWORK_MESSAGES.SAVED_TO_CLOUD) {
        notifications.show({
            title: 'Cloud Storage',
            message: 'Your progress successfully saved to cloud.',
            color: 'green',
            autoClose: 12000,
        });
    }
});
