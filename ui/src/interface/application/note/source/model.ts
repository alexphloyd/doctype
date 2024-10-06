import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { router } from '~/interface/kernel/router/mod.router';
import { createEffect } from '~/interface/shared/lib/create-effect';
import { notifications } from '~/interface/shared/lib/notifications';

import { type Note, type Source } from 'core/src/domain/note/types';

import { NoteManagerModelInterface } from '../manager/model';
import { api } from './api';

export class NoteSourceModel {
  source: Source | null = null;
  id: Note['id'];

  constructor(
    config: { id: Note['id'] },
    private noteManagerModel: NoteManagerModelInterface
  ) {
    makeAutoObservable(this);

    this.id = config.id;
    this.init.run();
  }

  init = createEffect(async () => {
    await this.noteManagerModel.init.meta.promise;
    this.noteManagerModel.pullCloud.run();

    const pullQuery = await api.getById({ id: this.id });
    const source = pullQuery.data?.note.source;

    if (source) {
      runInAction(() => {
        this.source = source;
      });

      this.noteManagerModel.setLastOpenedNote(this.id);
    } else {
      router.navigate('/');
      notifications.noteNotFound();
    }

    reaction(
      () => this.noteManagerModel.pool,
      () => {
        runInAction(() => {
          const pulled = this.noteManagerModel.pool.find((note) => note.id === this.id);
          if (pulled) {
            this.source = pulled.source;
          }
        });
      }
    );
  });

  updateSource = createEffect(async (payload: Source) => {
    const query = await api.updateSource({ id: this.id, source: payload });
    return query.data?.ok;
  });
}
