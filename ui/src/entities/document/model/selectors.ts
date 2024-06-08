import { useSelector } from 'react-redux';

import { type ModelState } from './types';

export const useDocuments = () => {
    return useSelector((state: AppState) => state.document.list);
};

export const useModelEffectStatus = <Effect extends keyof ModelState['effects']>(
    effect: Effect
) => {
    return useSelector((state: AppState) => state.document.effects[effect]);
};
