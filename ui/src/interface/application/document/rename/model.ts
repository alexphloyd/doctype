import { makeAutoObservable, runInAction } from 'mobx';
import { createEffect } from '~/interface/shared/lib/create-effect';
import { notifications } from '~/interface/shared/lib/notifications';

import { type Document } from 'core/src/domain/document/types';

import { documentManagerModel, DocumentManagerModelInterface } from '../manager/model';
import { api } from './api';

export class DocumentRenamingModel {
  process?: {
    id: Document['id'];
    input: Document['name'];
    initial: Document['name'];
  };

  constructor(private documentManagerModel: DocumentManagerModelInterface) {
    makeAutoObservable(this);
  }

  start(doc: Document) {
    this.process = {
      id: doc.id,
      initial: doc.name,
      input: doc.name,
    };
  }

  update(payload: Pick<Document, 'name'>) {
    const current = this.process;
    if (current) {
      runInAction(() => {
        this.process = {
          ...current,
          input: payload.name,
        };
      });
    }
  }

  apply = createEffect(async () => {
    if (this.process && this.process?.initial !== this.process?.input) {
      const renameQuery = await api.rename({
        data: {
          id: this.process.id,
          name: this.process.input.length ? this.process.input.trim() : this.process.initial,
        },
      });

      if (renameQuery.data?.ok) {
        await this.documentManagerModel.pull.run();
      } else {
        notifications.documentNotRenamed();
      }
    }

    runInAction(() => {
      this.process = undefined;
    });
  });
}

export const documentRenamingModel = new DocumentRenamingModel(documentManagerModel);
