import { useCvs } from '../model/selectors';
import { Preview } from './preview';

export const CvList = () => {
    const cvs = useCvs();

    return (
        <main className="w-full flex flex-row">
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 w-full gap-6">
                {cvs?.map((cv) => {
                    return <Preview key={cv.id} {...cv} />;
                })}
            </ul>
        </main>
    );
};
