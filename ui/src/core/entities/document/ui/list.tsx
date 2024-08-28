import { Kbd } from '@mantine/core';
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
      const shortcut =
        (event.metaKey && event.key === 'n') || (event.ctrlKey && event.key === 'n');
      if (shortcut) {
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
      <ul className="justify-start align-top items-start grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 w-full gap-y-12">
        {documents?.map((doc) => {
          return <Preview key={doc.id} {...doc} />;
        })}
      </ul>

      <div className="text-lg fixed bottom-[21px] right-6 text-gray-400 space-x-1 opacity-90">
        <Kbd>⌘</Kbd> <span>+</span> <Kbd>N</Kbd>
      </div>
    </m.main>
  );
};
