import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { initiate as initiateAuthModel } from '~/features/auth/model/initiate';

import { initiate as initiateCvModel } from '~/entities/cv/model/initiate';

import { listener } from './middleware';
import { reducer } from './reducer';

export const createStore = () => {
    const _store = configureStore({
        reducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().prepend(listener.middleware),
    });

    setupListeners(_store.dispatch);

    const extendedStore = {
        store: _store,

        and: function (callback: (dispatch: typeof _store.dispatch) => Promise<void> | void) {
            callback(_store.dispatch);
            return this;
        },
    };

    return extendedStore;
};

export const store = createStore().and(initiateAuthModel).and(initiateCvModel).store;
