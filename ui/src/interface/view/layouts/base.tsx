import { Layout } from '~/core/shared/ui/layout';
import { AppMenu } from '~/core/widgets/app-menu';

export const BaseLayout = () => {
  return <Layout isAppLoading={false} appMenuSlot={<AppMenu />} />;
};
