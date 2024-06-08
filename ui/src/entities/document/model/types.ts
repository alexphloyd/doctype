import { type Document } from 'core/src/domain/document/types';

export interface ModelState {
    list: Document[];
    effects: {
        create: EffectState;
        getLocallyStored: EffectState;
        getWithRemotelyStored: EffectState;
    };
}
