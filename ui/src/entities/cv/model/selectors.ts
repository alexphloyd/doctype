import { useSelector } from 'react-redux';

import { type ModelState } from './types';

export const useCvs = () => {
    return useSelector((state: AppState) => state.cv.list);
};

export const useModelEffectStatus = <Effect extends keyof ModelState['effects']>(
    effect: Effect
) => {
    return useSelector((state: AppState) => state.cv.effects[effect]);
};
