import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { router } from '~/interface/kernel/router/mod.router';
import { createEffect } from '~/interface/shared/lib/create-effect';
import { notifications } from '~/interface/shared/lib/notifications';

import { Document, type Source } from 'core/src/domain/document/types';

import { DocumentManagerModelInterface } from '../manager/model';
import { api } from './api';

export class DocumentSourceModel {
  source: Source | null = null;
  docId: Document['id'];

  constructor(
    config: { docId: Document['id'] },
    private documentNamagerModel: DocumentManagerModelInterface
  ) {
    makeAutoObservable(this);

    this.docId = config.docId;
    this.init.run();
  }

  init = createEffect(async () => {
    await this.documentNamagerModel.init.meta.promise;
    await this.documentNamagerModel.pullCloud.run();

    const pullQuery = await api.getById({ id: this.docId });
    const source = pullQuery.data?.doc.source;

    if (source) {
      runInAction(() => {
        this.source = source;
      });

      this.documentNamagerModel.setLastOpenedDoc(this.docId);
    } else {
      router.navigate('/');
      notifications.documentIsNotDefined();
    }

    reaction(
      () => this.documentNamagerModel.pool,
      () => {
        runInAction(() => {
          const pulled = this.documentNamagerModel.pool.find((doc) => doc.id === this.docId);
          if (pulled) {
            this.source = pulled.source;
          }
        });
      }
    );
  });

  updateSource = createEffect(async (payload: Source) => {
    const query = await api.updateSource({ id: this.docId, source: payload });
    return query.data?.ok;
  });
}