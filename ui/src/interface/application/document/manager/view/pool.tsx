import { Divider, Kbd, Paper } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useEffect, useLayoutEffect } from 'react';
import { QuickStart } from '~/interface/view/quick-start';

import { Search } from '../../search/view';
import { documentManagerModel } from '../model';
import { Preview } from './preview';

export const DocumentsPool = observer(() => {
  const pool = documentManagerModel.pool;

  useEffect(() => {
    const handleCreateShortcut = (event: KeyboardEvent) => {
      const triggered = event.altKey && event.code === 'KeyN';
      if (triggered) {
        event.preventDefault();
        documentManagerModel.create.run();
      }
    };

    window.addEventListener('keydown', handleCreateShortcut);
    return () => {
      window.removeEventListener('keydown', handleCreateShortcut);
    };
  }, []);

  useLayoutEffect(() => {
    if (documentManagerModel.pull.meta.status === 'fulfilled') {
      documentManagerModel.pull.run();
    }
  }, []);

  if (!pool.length) {
    return documentManagerModel.pull.meta.status === 'fulfilled' && <QuickStart />;
  } else {
    return (
      <>
        <ul className="justify-start align-top items-start grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 w-full gap-y-12 pb-20">
          {pool?.map((doc) => {
            return <Preview key={doc.id} {...doc} />;
          })}
        </ul>

        <Toolbar />
      </>
    );
  }
});

function Toolbar() {
  return (
    <Paper
      shadow="sm"
      className="px-3 py-2 fixed bottom-8 left-[50%] transform -translate-x-[50%] space-x-3 flex items-center justify-center z-50 overflow-hidden"
    >
      <Search />

      <Divider orientation="vertical" className="h-4 my-auto" />

      <Kbd className="h-7 w-7">
        <p className="-mt-[5px] text-[18px]">⌥</p>
      </Kbd>
      <span className="text-gray-400">+</span>
      <Kbd className="h-7 w-7 text-center font-['JetBrainsMono']">
        <p className="text-[14px] -mt-[1px]">N</p>
      </Kbd>
    </Paper>
  );
}
