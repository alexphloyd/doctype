import { combineReducers } from '@reduxjs/toolkit';
import { documentModel } from '~/core/entities/document/model/model';
import { authModel } from '~/core/features/auth/model/model';
import { appLoaderModel } from '~/core/shared/ui/app-loader/model';

export const reducer = combineReducers({
  [documentModel.name]: documentModel.reducer,
  [authModel.name]: authModel.reducer,

  [appLoaderModel.name]: appLoaderModel.reducer,
});
