import dayjs from 'dayjs';
import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { createEffect } from '~/interface/shared/lib/create-effect';
import { notifications } from '~/interface/shared/lib/notifications';
import { DEVOPS_DEPLOY_TEMPLATE } from '~/interface/view/editor/templates/devops.template';
import { MOBX_TEMPLATE } from '~/interface/view/editor/templates/mobx.templates';
import { getNoteTemplate } from '~/interface/view/editor/templates/note.template';
import { PROPOSAL_TEMPLATE } from '~/interface/view/editor/templates/proposal.template';

import { type Document } from 'core/src/domain/document/types';
import { NETWORK_MESSAGES } from 'core/src/infrastructure/networking/channel-messaging';

import { sessionModel, SessionModelInterface } from '../../session/model';
import { api } from './api';

class DocumentManagerModel {
  pool: Document[] = [];
  lastOpenedDoc: Document['id'] | null = null;

  constructor(private sessionModel: SessionModelInterface) {
    makeAutoObservable(this);
    this.init.run();
  }

  init = createEffect(async () => {
    this.pull.run();
    this.lastOpenedDoc = localStorage.getItem('last-opened-doc');

    reaction(
      () => this.sessionModel.session,
      () => this.pullCloud.run()
    );
  });

  create = createEffect(async (payload?: Pick<Document, 'name' | 'source'> | void) => {
    const name = payload?.name ?? 'Note: ' + '~' + dayjs().format('ss').toString();
    const query = await api.create({
      data: {
        name,
        source: payload?.source ?? getNoteTemplate({ name, date: dayjs().toString() }),
      },
    });

    if (query.data?.ok) {
      this.pull.run();
    } else {
      notifications.documentNotCreated();
    }
  });

  remove = createEffect(async (meta: { id: Document['id'] }) => {
    const query = await api.remove({
      data: meta,
    });

    if (query.data?.ok) {
      this.pull.run();
    } else {
      notifications.documentNotRemoved();
    }
  });

  pull = createEffect(async () => {
    const query = await api.pull();

    if (query.data?.items) {
      runInAction(() => {
        this.pool = query.data!.items;
      });
    } else {
      throw new Error(query.error?.response?.data.message);
    }
  });

  pullCloud = createEffect(async () => {
    const session = this.sessionModel.session;
    if (!session) {
      throw new Error('session is not defined');
    }

    const query = await api.pullCloud();
    if (query.data?.ok && query.data.updated) {
      runInAction(() => {
        this.pool = query.data!.items;
      });
      notifications.receivedCloudUpdates();
    } else {
      throw new Error(query.error?.response?.data.message);
    }
  });

  setLastOpenedDoc(id: Document['id']) {
    this.lastOpenedDoc = id;
    localStorage.setItem('last-opened-doc', id);
  }

  generateSample = createEffect(async () => {
    this.create.run({ name: 'Learn Mobx', source: MOBX_TEMPLATE });
    this.create.run({ name: 'Proposal: Safe Assignment Operator', source: PROPOSAL_TEMPLATE });
    this.create.run({ name: 'DevOps: Deploy Notes', source: DEVOPS_DEPLOY_TEMPLATE });
  });
}

export const documentManagerModel = new DocumentManagerModel(sessionModel);

navigator.serviceWorker.addEventListener('message', ({ data: key }) => {
  if (key === NETWORK_MESSAGES.SAVED_TO_CLOUD) {
    notifications.progressSavedToCloud();
  }
});

export type DocumentManagerModelInterface = DocumentManagerModel;
