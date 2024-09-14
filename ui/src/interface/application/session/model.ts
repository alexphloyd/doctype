import { makeAutoObservable } from 'mobx';
import { type Session } from '~/interface/domain/session';
import { createEffect } from '~/interface/shared/lib/create-effect';
import { notifications } from '~/interface/shared/lib/notifications';

import { AUTH_MESSAGES } from 'core/src/domain/auth/channel-messaging';

import { api } from './api';

class SessionModel {
  session: Session = null;

  constructor() {
    makeAutoObservable(this);
    this.init();
  }

  init() {
    this.defineSession.run();

    window.addEventListener('online', () => {
      this.defineSession.run();
    });
  }

  upsert(payload: Session) {
    this.session = payload;
  }

  logout() {
    this.session = null;
    navigator.serviceWorker.controller?.postMessage(AUTH_MESSAGES.LOGOUT);
  }

  defineSession = createEffect(async () => {
    const query = await api.getSession();

    if (query.data?.user) {
      this.upsert(query.data.user);
    } else {
      notifications.showCloudSyncReminder();
    }
  });
}

export const sessionModel = new SessionModel();

export type SessionModelInterface = SessionModel;
