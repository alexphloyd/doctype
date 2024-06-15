import { Paper, TextInput } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import { type Document } from 'core/src/domain/document/types';
import dayjs from 'dayjs';
import { ChangeEvent, memo, useEffect } from 'react';

import { useAppDispatch } from '~/app/store/hooks';

import { applyRename } from '../model/effects/apply-rename';
import { startRenamingProcess, updateRenamingProcess } from '../model/model';
import { useRenamingProcess } from '../model/selectors';

export const Preview = memo((doc: Document) => {
    return (
        <div className="flex flex-col items-center">
            <Paper
                withBorder
                classNames={{
                    root: 'min-w-[10.5rem] min-h-[10.5rem] mb-[6px] cursor-pointer border-borderDark',
                }}
            />

            <Name {...doc} key={doc.id} />
            <span className="mt-[1px] text-[0.71rem] text-fontSecondary">
                {dayjs(doc.lastUpdatedTime).format('D MMMM h:mm A').toString()}
            </span>
        </div>
    );
});

const Name = (doc: Document) => {
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
                    input: 'text-center border-accent border-dashed max-w-[10.5rem] w-[10.5rem] text-sm min-h-0 h-[1.44rem] px-2 rounded-sm',
                }}
                size="xs"
                autoFocus
            />
        );
    } else {
        return (
            <div
                className="text-sm flex items-center h-[1.44rem] w-[10.5rem] max-w-[10.5rem] hover:border-dashed hover:border-spacing-4 hover:border-[1px] border-gray-400/45 box-border rounded-sm truncate px-2 hover:px-[7px]"
                onClick={startRenaming}
            >
                <span className="truncate text-center w-full"> {doc.name}</span>
            </div>
        );
    }
};
