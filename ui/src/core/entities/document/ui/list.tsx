import { m } from 'framer-motion';

import { useDocuments } from '../model/selectors';
import { Preview } from './preview';

export const DocumentsList = () => {
  const documents = useDocuments();

  return (
    <m.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.2,
        ease: 'easeIn',
      }}
      className="w-full"
    >
      <ul className="justify-start align-top items-start grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 w-full gap-y-12">
        {documents?.map((doc) => {
          return <Preview key={doc.id} {...doc} />;
        })}
      </ul>
    </m.main>
  );
};
