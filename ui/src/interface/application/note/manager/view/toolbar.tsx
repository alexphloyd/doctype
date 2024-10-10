import { Divider, Kbd, Paper, Portal } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

import { Search } from '../../search/view';
import { notesManagerModel } from '../model';

export const Toolbar = observer(() => {
  useEffect(() => {
    const handleCreateShortcut = (event: KeyboardEvent) => {
      const triggered = event.altKey && event.code === 'KeyN';
      if (triggered) {
        event.preventDefault();
        notesManagerModel.create.run();
      }
    };

    window.addEventListener('keydown', handleCreateShortcut);
    return () => {
      window.removeEventListener('keydown', handleCreateShortcut);
    };
  }, []);

  return (
    <Portal>
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
    </Portal>
  );
});
