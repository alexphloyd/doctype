import { useParams } from 'react-router-dom';

import { Editor as EditorComponent } from '~/features/editor/ui/editor';

export const Editor = () => {
    const { id } = useParams();

    return (
        <main className="flex w-full px-[2%] lg:px-[3%] items-center justify-center">
            <span className="text-sm hidden">slug --{id}</span>
            <EditorComponent />
        </main>
    );
};
