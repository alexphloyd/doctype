import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

const initialState: ModelState = {
  queries: {},
};

export const appLoaderModel = createSlice({
  name: 'appLoader',
  initialState,
  reducers: {
    queryStarted(state, action: PayloadAction<QueryId>) {
      state.queries[action.payload] = 'query';
    },
    queryFinished(state, action: PayloadAction<QueryId>) {
      delete state.queries[action.payload];
    },
  },
});

export const useAppLoading = () => {
  return useSelector((state: AppState) => Boolean(Object.keys(state.appLoader.queries).length));
};

export const { queryFinished, queryStarted } = appLoaderModel.actions;

type ModelState = {
  queries: Record<QueryId, string>;
};
type QueryId = string;
