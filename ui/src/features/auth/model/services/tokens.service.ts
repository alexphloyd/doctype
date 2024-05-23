const getAccess = () => localStorage.getItem('access');
const getRefresh = () => localStorage.getItem('refresh');

const set = ({ access, refresh }: { access: string; refresh: string }) => {
    localStorage.setItem('access', access);
    localStorage.setItem('refresh', refresh);
};

const reset = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
};

export const tokensService = {
    getRefresh,
    getAccess,
    set,
    reset,
};
