import { observer } from 'mobx-react-lite';
import { AppActionButton } from '~/interface/shared/view/buttons/action';
import { Icon } from '~/interface/shared/view/icon';

import { documentManagerModel } from '../application/document/manager/model';
import { SessionAction } from '../application/session/view';
import { useLocationArray } from '../kernel/router/use-location-array';
import { NavigationButton } from '../shared/view/buttons/navigation';

export const AppNavigation = observer(() => {
  const lastOpenedDoc = documentManagerModel.lastOpenedDoc;

  return (
    <header className="py-[0.9rem] flex flex-col min-h-screen min-w-full">
      <section className="gap-y-2 flex flex-col grow">
        <NavigationButton
          pushTo="/"
          content={<Icon name="home" className="w-[1.09rem] h-[1.09rem] text-accent" />}
        />

        {lastOpenedDoc && (
          <NavigationButton
            pushTo={'/notes/' + lastOpenedDoc}
            content={<Icon name="app" className="w-[1.09rem] h-[1.09rem] text-accent" />}
          />
        )}

        <HomeSegment />
        <EditorSegment />
      </section>

      <section className="flex flex-col items-center justify-center">
        <SessionAction />
      </section>
    </header>
  );
});

const HomeSegment = () => {
  const location = useLocationArray();
  const show = location[0] === '';

  const createDocument = () => {
    documentManagerModel.create.run();
  };

  return (
    <section hidden={!show}>
      <AppActionButton
        debounce
        onClick={createDocument}
        content={<Icon name="write" className="w-[1.09rem] h-[1.09rem] text-accent" />}
      />
    </section>
  );
};

const EditorSegment = () => {
  const location = useLocationArray();
  const show = location[0] === 'notes';

  return (
    <section hidden={!show}>
      <AppActionButton
        onClick={() => null}
        content={<Icon name="share" className="w-[1.09rem] h-[1.09rem] text-accent" />}
      />
    </section>
  );
};
