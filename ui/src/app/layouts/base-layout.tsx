import { AppMenu } from '~/widgets/app-menu';

import { useModelLoading as useAuthModelLoading } from '~/features/auth/model/selectors';

import { useModelLoading as useCvModelLoading } from '~/entities/cv/model/selectors';

import { Layout } from '~/shared/ui/layout';

import { serviceWorkerState } from '../store/service-worker.state';

export const BaseLayout = () => {
    const authModelLoading = useAuthModelLoading();
    const cvModelLoading = useCvModelLoading();
    const serviceWorkerActivated = serviceWorkerState.useActivated();

    const isLoading = authModelLoading || cvModelLoading || !serviceWorkerActivated;

    return <Layout isAppLoading={isLoading} appMenuSlot={<AppMenu />} />;
};
