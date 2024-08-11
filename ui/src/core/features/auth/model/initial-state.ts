import { type ModelState } from './types';

export const initialState: ModelState = {
  session: undefined,

  processes: {
    signIn: {
      step: 'credentials',
      tab: 'sign-up',
      credentials: undefined,
    },
    login: {
      error: undefined,
    },
  },

  effects: {
    defineSession: {
      error: undefined,
      status: 'idle',
      firstExecution: true,
    },
    login: {
      error: undefined,
      status: 'idle',
      firstExecution: true,
    },
    signUp: {
      error: undefined,
      status: 'idle',
      firstExecution: true,
    },
    verify: {
      error: undefined,
      status: 'idle',
      firstExecution: true,
    },
    loginWithOAuth: {
      error: undefined,
      status: 'idle',
      firstExecution: true,
    },
  },
};
