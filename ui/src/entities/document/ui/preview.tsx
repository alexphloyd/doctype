import { type Document } from 'core/src/domain/document/types';
import dayjs from 'dayjs';

export const Preview = (props: Document) => {
    return (
        <div className="flex flex-col items-center justify-center">
            <section className="mb-[5px] bg-white/70 flex items-center justify-center min-w-[10.5rem] min-h-[10.5rem] rounded-md shadow-sm cursor-pointer" />

            <h4 className="text-sm">{props.title}</h4>
            <span className="text-[0.72rem] text-fontSecondary">
                {dayjs(props.creationDate).format('D MMMM h:mm A').toString()}
            </span>
        </div>
    );
};
