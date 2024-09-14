import { HttpStatusCode } from 'axios';
import { makeAutoObservable } from 'mobx';
import { z } from 'zod';
import { router } from '~/interface/kernel/router/mod.router';
import { createEffect } from '~/interface/shared/lib/create-effect';
import { notifications } from '~/interface/shared/lib/notifications';
import { signInViewModel, SignInViewModelInterface } from '~/interface/view/sign-in/model';

import { LoginDto } from 'core/src/domain/auth/validation';

import { sessionModel, type SessionModelInterface } from '../../session/model';
import { registrationModel, RegistrationModelInterface } from '../registration/model';
import { api } from './api';

class LoginModel {
  constructor(
    private sessionModel: SessionModelInterface,
    private registrationModel: RegistrationModelInterface,
    private signInViewModel: SignInViewModelInterface
  ) {
    makeAutoObservable(this);
  }

  login = createEffect(async (creds: z.infer<typeof LoginDto>) => {
    const query = await api.login({ data: creds });
    const session = query.data?.user;

    if (session) {
      this.sessionModel.upsert(session);
    }

    const isVerificationNeeded = query.error?.status === HttpStatusCode.UpgradeRequired;
    if (session && !isVerificationNeeded) {
      router.navigate('/');
    }

    if (isVerificationNeeded) {
      notifications.notVerifiedAccount();

      this.registrationModel.upsertCredentials({ email: creds.email });
      this.registrationModel.changeStep('verification');
      this.signInViewModel.changeTab('registration');
    }

    if (!isVerificationNeeded && query.error) {
      throw new Error(query.error?.response?.data?.message);
    }
  });
}

export const loginModel = new LoginModel(sessionModel, registrationModel, signInViewModel);
