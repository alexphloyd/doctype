import { Avatar } from '@mantine/core';
import { m } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import { AppActionButton } from '~/interface/shared/view/buttons/action';
import { Icon } from '~/interface/shared/view/icon';

import { sessionModel } from '../application/session/model';
import { useNetworkState } from '../kernel/network/use-network-state';
import { useLocationArray } from '../kernel/router/use-location-array';
import { NavigationButton } from '../shared/view/buttons/navigation';

export const AppNavigation = () => {
  return (
    <header className="py-[0.9rem] flex flex-col min-h-screen min-w-full">
      <section className="gap-y-2 flex flex-col grow">
        <NavigationButton
          pushTo="/"
          content={<Icon name="home" className="w-[1.09rem] h-[1.09rem] text-accent" />}
        />
        <NavigationButton
          pushTo="/editor/demo"
          content={<Icon name="app" className="w-[1.09rem] h-[1.09rem] text-accent" />}
        />

        <HomeSegment />
        <EditorSegment />
      </section>

      <section className="flex flex-col items-center justify-center">
        <AuthActionButton />
      </section>
    </header>
  );
};

const HomeSegment = () => {
  const location = useLocationArray();
  const show = location[0] === '';

  const _createDocument = () => {
    // dispatch(createDocument());
  };

  return (
    <section hidden={!show}>
      <AppActionButton
        debounce
        onClick={_createDocument}
        content={<Icon name="write" className="w-[1.09rem] h-[1.09rem] text-accent" />}
      />
    </section>
  );
};

const EditorSegment = () => {
  const location = useLocationArray();
  const show = location[0] === 'editor';

  return (
    <section hidden={!show}>
      <AppActionButton
        onClick={() => null}
        content={<Icon name="share" className="w-[1.09rem] h-[1.09rem] text-accent" />}
      />
    </section>
  );
};

const AuthActionButton = observer(() => {
  const network = useNetworkState();
  const session = sessionModel.session;

  const logout = () => {
    sessionModel.logout();
  };

  if (!session && network.online) {
    return (
      <NavigationButton
        className="px-[9.5px] py-[7px] "
        pushTo="/sign-in"
        content={
          <Icon name="login" className="w-[1.29rem] h-[1.29rem] text-accent -ml-[0.5px]" />
        }
      />
    );
  }

  if (session) {
    return (
      <m.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.2,
          ease: 'easeIn',
        }}
      >
        <Avatar
          styles={{ root: { cursor: 'pointer', marginBottom: '-5px' } }}
          src="/avatar-placeholder.png"
          size="md"
          onClick={logout}
        />
      </m.div>
    );
  }
});
