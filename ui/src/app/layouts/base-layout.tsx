import { AppMenu } from '~/widgets/app-menu';

import { Layout } from '~/shared/ui/layout';

export const BaseLayout = () => {
    return <Layout isAppLoading={false} appMenuSlot={<AppMenu />} />;
};
