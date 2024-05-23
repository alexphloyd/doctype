import { combineReducers } from '@reduxjs/toolkit';

import { authModel } from '~/features/auth/model/model';

import { cvModel } from '~/entities/cv/model/model';

export const reducer = combineReducers({
    [authModel.name]: authModel.reducer,

    [cvModel.name]: cvModel.reducer,
});
