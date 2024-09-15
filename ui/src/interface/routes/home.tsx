import { m } from 'framer-motion';

import { DocumentsPool } from '../application/document/manager/view/pool';

export const Home = () => {
  return (
    <m.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.1,
        ease: 'easeIn',
      }}
      className="w-full relative"
    >
      <DocumentsPool />
    </m.main>
  );
};
