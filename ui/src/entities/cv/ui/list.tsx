import { m } from 'framer-motion';

import { useCvs } from '../model/selectors';
import { Preview } from './preview';

export const CvList = () => {
    const cvs = useCvs();

    return (
        <m.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
                duration: 0.2,
                ease: 'easeIn',
            }}
            className="w-full flex flex-row"
        >
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 w-full gap-6">
                {cvs?.map((cv) => {
                    return <Preview key={cv.id} {...cv} />;
                })}
            </ul>
        </m.main>
    );
};
