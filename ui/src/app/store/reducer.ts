import { combineReducers } from '@reduxjs/toolkit';

import { authModel } from '~/features/auth/model/model';

import { documentModel } from '~/entities/document/model/model';

import { appLoaderModel } from '~/shared/ui/app-loader/model';

export const reducer = combineReducers({
    [documentModel.name]: documentModel.reducer,
    [authModel.name]: authModel.reducer,

    [appLoaderModel.name]: appLoaderModel.reducer,
});
