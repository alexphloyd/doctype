import type { User } from '@prisma/client';

export interface ModelState {
  session?: User;

  processes: {
    signIn: SignInProcess;
    login: LoginProcess;
  };

  effects: {
    defineSession: EffectState;
    login: EffectState;
    signUp: EffectState;
    verify: EffectState;
    loginWithOAuth: EffectState;
  };
}

export type SignInProcess = {
  tab: Tab;
  step: Step;
  credentials?: Partial<User>;
};

export type LoginProcess = {
  error?: ApiErrorData;
};

export type Tokens = {
  access: string;
  refresh: string;
};

export type Tab = 'sign-up' | 'log-in';

export type Step = 'credentials' | 'verification';
