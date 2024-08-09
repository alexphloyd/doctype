import { useSelector } from 'react-redux';

export const useSignInProcessStep = () => {
    return useSelector((state: AppState) => state.auth.processes.signIn.step);
};

export const useSignInProcessTab = () => {
    return useSelector((state: AppState) => state.auth.processes.signIn.tab);
};
export const useSignInProcessCredentials = () => {
    return useSelector((state: AppState) => state.auth.processes.signIn.credentials);
};

export const useSession = () => {
    return useSelector((state: AppState) => state.auth.session);
};

export const useLoginProcess = () => {
    return useSelector((state: AppState) => state.auth.processes.login);
};

export const useDefineSessionEffectState = () => {
    return useSelector((state: AppState) => state.auth.effects.defineSession);
};

export const useLoginEffectState = () => {
    return useSelector((state: AppState) => state.auth.effects.login);
};

export const useSignUpEffectState = () => {
    return useSelector((state: AppState) => state.auth.effects.signUp);
};

export const useVerifyEffectState = () => {
    return useSelector((state: AppState) => state.auth.effects.verify);
};
