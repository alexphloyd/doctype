import { notifications } from '@mantine/notifications';
import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { type Document } from 'core/src/domain/document/types';
import { NETWORK_MESSAGES } from 'core/src/infrastructure/networking/channel-messaging';
import { on } from '~/core/app/store/middleware';
import { queryFinished, queryStarted } from '~/core/shared/ui/app-loader/model';

import { applyRename } from './effects/apply-rename';
import { create } from './effects/create';
import { getLocallyStored } from './effects/get-locally-stored';
import { getWithRemotelyStored } from './effects/get-with-remotely-stored';
import { initialState } from './initial-state';

export const documentModel = createSlice({
    name: 'document',
    initialState,
    reducers: {
        startRenamingProcess(state, action: PayloadAction<Document>) {
            const doc = action.payload;

            state.processes.renaming = {
                docId: doc.id,
                initial: doc.name,
                input: doc.name,
            };
        },
        updateRenamingProcess(state, action: PayloadAction<Pick<Document, 'name'>>) {
            const currentData = state.processes.renaming;
            if (currentData) {
                state.processes.renaming = {
                    ...currentData,
                    input: action.payload.name,
                };
            }
        },
    },
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

        builder.addCase(applyRename.fulfilled, (state) => {
            state.processes.renaming = undefined;
        });
        builder.addCase(applyRename.rejected, (state) => {
            state.processes.renaming = undefined;
        });
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

export const { startRenamingProcess, updateRenamingProcess } = documentModel.actions;

on({
    actionCreator: getWithRemotelyStored.pending,
    effect: (action, { dispatch }) => {
        dispatch(queryStarted(action.meta.requestId));
    },
});

on({
    actionCreator: getWithRemotelyStored.rejected,
    effect: (action, { dispatch }) => {
        dispatch(queryFinished(action.meta.requestId));
    },
});

on({
    actionCreator: getWithRemotelyStored.fulfilled,
    effect: (action, { dispatch }) => {
        dispatch(queryFinished(action.meta.requestId));
    },
});
