import { useParams } from 'react-router-dom';

export const Editor = () => {
    const { id } = useParams();

    return (
        <main className="flex w-full px-[2%] lg:px-[3%]">
            <span className="text-sm hidden">slug --{id}</span>
        </main>
    );
};
