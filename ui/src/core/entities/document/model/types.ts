import { type Document } from 'core/src/domain/document/types';

export interface ModelState {
  list: Document[];
  processes: {
    renaming?: {
      docId: Document['id'];
      initial: string;
      input: string;
    };
  };
  effects: {
    create: EffectState;
    getLocallyStored: EffectState;
    getWithRemotelyStored: EffectState;
  };
}
