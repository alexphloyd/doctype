import { useEffect, useState } from 'react';

export const serviceWorkerState = {
    activated: isActivated(),
    useActivated,
};

function isActivated() {
    return new Promise<boolean>((resolve) => {
        (async () => {
            const handler = async () => {
                resolve(true);
                navigator.serviceWorker.removeEventListener('controllerchange', handler);
            };

            if ((await navigator.serviceWorker.ready).active?.state === 'activated') {
                resolve(true);
            } else {
                navigator.serviceWorker.addEventListener('controllerchange', handler);
            }
        })();
    });
}

function useActivated() {
    const [isActivated, setIsActivated] = useState(false);
    useEffect(() => {
        serviceWorkerState.activated.then(() => setIsActivated(true));
    }, []);

    return isActivated;
}
