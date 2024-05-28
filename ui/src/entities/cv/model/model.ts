import { createSlice } from '@reduxjs/toolkit';

import { create } from './effects/create';
import { getMany } from './effects/get-many';
import { initialState } from './initial-state';

export const cvModel = createSlice({
    name: 'cv',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getMany.pending, (state, { meta }) => {
            state.effects.getMany.status = meta.requestStatus;
        });
        builder.addCase(getMany.fulfilled, (state, { payload, meta }) => {
            state.list = payload.list;
            state.effects.getMany.status = meta.requestStatus;
            state.effects.getMany.error = undefined;

            state.effects.getMany.firstExecution = false;
        });
        builder.addCase(getMany.rejected, (state, { payload, meta }) => {
            state.effects.getMany.status = meta.requestStatus;
            state.effects.getMany.error = payload;

            state.effects.getMany.firstExecution = false;
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

export const actions = cvModel.actions;
