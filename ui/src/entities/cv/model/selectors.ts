import { useSelector } from 'react-redux';

export const useCvs = () => {
    return useSelector((state: AppState) => state.cv.list);
};

export const useGetManyEffectState = () => {
    return useSelector((state: AppState) => state.cv.effects.getMany);
};

export const useModelLoading = () => {
    return useSelector(
        (state: AppState) =>
            state.cv.effects.getMany.firstExecution &&
            state.cv.effects.getMany.status === 'pending'
    );
};
