import { type User } from '@prisma/client';
import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { messageBuilder } from 'core/src/infrastructure/channel-messaging/messages';

import { UNEXPECTED_ERROR } from '~/shared/api-client/main';

import { defineSession } from './effects/define-session';
import { login } from './effects/login';
import { loginWithOAuth } from './effects/login-with-oauth';
import { signUp } from './effects/sign-up';
import { verify } from './effects/verify';
import { initialState } from './initial-state';
import { type Tab, type Step } from './types';

export const authModel = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        registerSession(state, action: PayloadAction<User>) {
            state.session = action.payload;
        },

        logout() {
            navigator.serviceWorker.controller?.postMessage(messageBuilder.LOGOUT());
            return initialState;
        },

        changeSignInProcessTab(state, action: PayloadAction<Tab>) {
            state.processes.signIn.tab = action.payload;
        },

        changeSignInProcessStep(state, action: PayloadAction<Step>) {
            state.processes.signIn.step = action.payload;
        },

        updateSignInProcessCredentials(state, action: PayloadAction<Partial<User>>) {
            state.processes.signIn.credentials = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(defineSession.pending, (state, { meta }) => {
            state.effects.defineSession.status = meta.requestStatus;
        });
        builder.addCase(defineSession.fulfilled, (state, { meta }) => {
            state.effects.defineSession.status = meta.requestStatus;
            state.effects.defineSession.firstExecution = false;
        });
        builder.addCase(defineSession.rejected, (state, { meta }) => {
            state.effects.defineSession.status = meta.requestStatus;
            state.effects.defineSession.firstExecution = false;
        });

        builder.addCase(login.pending, (state, { meta }) => {
            state.effects.login.status = meta.requestStatus;
        });
        builder.addCase(login.fulfilled, (state, { meta }) => {
            state.effects.login.status = meta.requestStatus;
            state.effects.login.error = undefined;
        });
        builder.addCase(login.rejected, (state, { payload, meta }) => {
            state.effects.login.status = meta.requestStatus;
            state.effects.login.error = payload || UNEXPECTED_ERROR;
        });

        builder.addCase(signUp.pending, (state, { meta }) => {
            state.effects.signUp.status = meta.requestStatus;
        });
        builder.addCase(signUp.fulfilled, (state, { meta }) => {
            state.effects.signUp.status = meta.requestStatus;
            state.effects.signUp.error = undefined;
        });
        builder.addCase(signUp.rejected, (state, { payload, meta }) => {
            state.effects.signUp.status = meta.requestStatus;
            state.effects.signUp.error = payload || UNEXPECTED_ERROR;
        });

        builder.addCase(verify.pending, (state, { meta }) => {
            state.effects.verify.status = meta.requestStatus;
        });
        builder.addCase(verify.fulfilled, (state, { meta }) => {
            state.effects.verify.status = meta.requestStatus;
            state.effects.verify.error = undefined;
        });
        builder.addCase(verify.rejected, (state, { payload, meta }) => {
            state.effects.verify.status = meta.requestStatus;
            state.effects.verify.error = payload || UNEXPECTED_ERROR;
        });

        builder.addCase(loginWithOAuth.pending, (state, { meta }) => {
            state.effects.loginWithOAuth.status = meta.requestStatus;
        });
        builder.addCase(loginWithOAuth.fulfilled, (state, { meta }) => {
            state.effects.loginWithOAuth.status = meta.requestStatus;
            state.effects.loginWithOAuth.error = undefined;

            state.processes.login.error = undefined;
        });
        builder.addCase(loginWithOAuth.rejected, (state, { payload, meta }) => {
            state.effects.loginWithOAuth.status = meta.requestStatus;
            state.effects.loginWithOAuth.error = payload || UNEXPECTED_ERROR;
        });
    },
});

export const actions = authModel.actions;
