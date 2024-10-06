import { makeAutoObservable, runInAction } from 'mobx';
import { createEffect } from '~/interface/shared/lib/create-effect';
import { notifications } from '~/interface/shared/lib/notifications';

import { type Note } from 'core/src/domain/note/types';

import { notesManagerModel, NoteManagerModelInterface } from '../manager/model';
import { api } from './api';

export class NoteRenameModel {
  process?: {
    id: Note['id'];
    input: Note['name'];
    initial: Note['name'];
  };

  constructor(private noteManagerModel: NoteManagerModelInterface) {
    makeAutoObservable(this);
  }

  start(note: Note) {
    this.process = {
      id: note.id,
      initial: note.name,
      input: note.name,
    };
  }

  update(payload: Pick<Note, 'name'>) {
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
        await this.noteManagerModel.pull.run();
      } else {
        notifications.noteNotRenamed();
      }
    }

    runInAction(() => {
      this.process = undefined;
    });
  });
}

export const noteRenameModel = new NoteRenameModel(notesManagerModel);
