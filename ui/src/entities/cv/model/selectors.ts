import { useSelector } from 'react-redux';

export const useCvs = () => {
    return useSelector((state: AppState) => state.cv.list);
};

export const useGetManyEffectState = () => {
    return useSelector((state: AppState) => state.cv.effects.getLocallyStored);
};
