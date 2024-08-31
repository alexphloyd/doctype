import { Kbd, Paper } from '@mantine/core';
import { m } from 'framer-motion';
import { useEffect } from 'react';
import { useAppDispatch } from '~/core/app/store/hooks';

import { create } from '../model/effects/create';
import { useDocuments } from '../model/selectors';
import { Preview } from './preview';

export const DocumentsList = () => {
  const documents = useDocuments();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleCreateShortcut = (event: KeyboardEvent) => {
      const triggered = event.altKey && event.code === 'KeyN';
      if (triggered) {
        event.preventDefault();
        dispatch(create());
      }
    };

    window.addEventListener('keydown', handleCreateShortcut);
    return () => {
      window.removeEventListener('keydown', handleCreateShortcut);
    };
  }, []);

  return (
    <m.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.2,
        ease: 'easeIn',
      }}
      className="w-full relative"
    >
      <ul className="justify-start align-top items-start grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 w-full gap-y-12 pb-16">
        {documents?.map((doc) => {
          return <Preview key={doc.id} {...doc} />;
        })}
      </ul>

      <Paper
        shadow="sm"
        className="px-3 py-2 fixed bottom-8 left-[50%] transform -translate-x-[50%] space-x-2 flex items-center justify-center z-50 overflow-hidden"
      >
        <Kbd className="h-7 w-7">
          <p className="-mt-[5px] text-[18px]">⌥</p>
        </Kbd>
        <span className="text-gray-400">+</span>
        <Kbd className="h-7 w-7 text-center">
          <p className="text-[12px]">N</p>
        </Kbd>
      </Paper>
    </m.main>
  );
};
