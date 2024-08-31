import { CloseButton, Paper, TextInput } from '@mantine/core';
import { useClickOutside, useDisclosure, useHover } from '@mantine/hooks';
import { type Document } from 'core/src/domain/document/types';
import dayjs from 'dayjs';
import { ChangeEvent, memo, MouseEventHandler, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '~/core/app/store/hooks';
import { Icon } from '~/core/shared/ui/icon';

import { applyRename } from '../model/effects/apply-rename';
import { startRenamingProcess, updateRenamingProcess } from '../model/model';
import { useRenamingProcess } from '../model/selectors';
import './preview.css';
import { RemoveModal } from './remove.modal';

export const Preview = memo((doc: Document) => {
  const navigate = useNavigate();
  const { ref: paperRef, hovered } = useHover();
  const [removeModalOpened, { open: _openRemoveModal, close: closeRemoveModal }] =
    useDisclosure(false);

  const openInEditor = () => {
    navigate('/editor/demo');
  };

  const openRemoveModal: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    _openRemoveModal();
  };

  return (
    <div className="flex flex-col items-center">
      <Paper
        ref={paperRef}
        withBorder={hovered}
        onClick={openInEditor}
        shadow="sm"
        classNames={{
          root: 'min-w-[15.6rem] min-h-[11.5rem] max-w-[15.6rem] max-h-[11.5rem] mb-[7px] cursor-pointer relative border-solid border-[1px] border-transparent hover:border-borderLight overflow-hidden',
        }}
      >
        {(hovered || removeModalOpened) && (
          <CloseButton
            onClick={openRemoveModal}
            className="absolute top-[6px] right-[6px] overflow-hidden bg-white"
            icon={
              <Icon
                name="trash"
                width="19px"
                height="16px"
                className="w-[19px] h-[16px] text-gray-500"
              />
            }
          />
        )}
      </Paper>

      <Name {...doc} key={doc.id} />
      <span className="mt-[1px] text-[0.71rem] text-fontSecondary">
        {dayjs(doc.lastUpdatedTime).format('D MMMM h:mm A').toString()}
      </span>

      <RemoveModal doc={doc} opened={removeModalOpened} onClose={closeRemoveModal} />
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
          input:
            'text-center focus:border-black/20 focus border-solid max-w-[15.5rem] w-[15.5rem] text-sm min-h-0 h-[1.44rem] px-2 rounded',
        }}
        size="xs"
        autoFocus
      />
    );
  } else {
    return (
      <div
        className="text-sm flex items-center h-[1.44rem] w-[15.5rem] max-w-[15.5rem] hover:border-dashed hover:border-spacing-4 hover:border-[1px] border-gray-400/45 box-border rounded-sm truncate px-2 hover:px-[7px]"
        onClick={startRenaming}
      >
        <span className="truncate text-center w-full">{doc.name}</span>
      </div>
    );
  }
};
