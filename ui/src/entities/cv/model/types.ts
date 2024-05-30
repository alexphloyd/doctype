import { type Cv } from 'core/src/domain/cv/types';

export interface ModelState {
    list: Cv[];
    effects: {
        create: EffectState;
        getLocallyStored: EffectState;
        getWithRemotelyStored: EffectState;
    };
}
