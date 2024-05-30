import { useEffect, useState } from 'react';

export const useNetworkState = () => {
    const [online, setOnline] = useState(navigator.onLine);
    useEffect(() => {
        const handle = () => {
            setOnline(navigator.onLine);
        };

        window.addEventListener('online', handle);
        window.addEventListener('offline', handle);

        return () => {
            window.removeEventListener('online', handle);
            window.removeEventListener('offline', handle);
        };
    }, []);

    return { online };
};
