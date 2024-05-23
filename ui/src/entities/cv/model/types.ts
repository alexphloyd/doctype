import { type Cv } from 'core/src/domain/cv/types/main';

export interface ModelState {
    list: Cv[];
    effects: {
        create: EffectState;
        getMany: EffectState;
    };
}
