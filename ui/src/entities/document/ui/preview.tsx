import { TextInput } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import { type Document } from 'core/src/domain/document/types';
import dayjs from 'dayjs';
import { ChangeEvent, useEffect } from 'react';

import { useAppDispatch } from '~/app/store/hooks';

import { applyRename } from '../model/effects/apply-rename';
import { startRenamingProcess, updateRenamingProcess } from '../model/model';
import { useRenamingProcess } from '../model/selectors';

export const Preview = ({ doc }: { doc: Document }) => {
    return (
        <div className="flex flex-col items-center">
            <section className="mb-[6px] bg-white/70 flex items-center justify-center min-w-[10.5rem] min-h-[10.5rem] rounded-sm shadow-sm cursor-pointer" />

            <Name doc={doc} />
            <span className="mt-[1px] text-[0.71rem] text-fontSecondary">
                {dayjs(doc.lastUpdatedTime).format('D MMMM h:mm A').toString()}
            </span>
        </div>
    );
};

const Name = ({ doc }: { doc: Document }) => {
    const dispatch = useAppDispatch();
    const renamingProcess = useRenamingProcess();

    const inputNodeRef = useClickOutside(() => {
        dispatch(applyRename());
    });

    const startRenaming = async () => {
        const processExisted = Boolean(renamingProcess);
        if (processExisted) {
            await dispatch(applyRename()).unwrap();
        }

        dispatch(startRenamingProcess(doc));
    };
    const updateRenaming = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch(updateRenamingProcess({ name: event.currentTarget.value }));
    };

    useEffect(() => {
        if (renamingProcess && inputNodeRef.current) {
            const caretPosition = renamingProcess.initial.length;
            inputNodeRef.current.setSelectionRange(caretPosition, caretPosition);
        }
    }, [renamingProcess?.docId]);

    if (renamingProcess?.docId === doc.id) {
        return (
            <TextInput
                ref={inputNodeRef}
                value={renamingProcess.input}
                onChange={updateRenaming}
                onKeyDown={(event) => {
                    if (event.key === 'Escape' || event.key === 'Enter') {
                        dispatch(applyRename());
                    }
                }}
                classNames={{
                    input: 'text-center border-accent/30 max-w-[9.8rem] w-[9.8rem] text-sm min-h-0 h-[1.44rem] px-2 rounded-sm',
                }}
                size="xs"
                autoFocus
            />
        );
    } else {
        return (
            <div
                className="text-sm flex items-center h-[1.44rem] w-[9.8rem] max-w-[9.8rem] hover:outline-dashed outline-[1px] outline-borderPrimary rounded-sm truncate px-2"
                onClick={startRenaming}
            >
                <span className="truncate text-center w-full"> {doc.name}</span>
            </div>
        );
    }
};
