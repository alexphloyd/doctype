import { Button, FocusTrap, Modal } from '@mantine/core';

import { type Note } from 'core/src/domain/note/types';

import { notesManagerModel } from '../model';

interface Props {
  opened: boolean;
  onClose: () => void;
  note: Note;
}

export const RemoveModal = (props: Props) => {
  const removeEffect = () => {
    notesManagerModel.remove.run({ id: props.note.id });
    props.onClose();
  };

  return (
    <Modal
      opened={props.opened}
      onClose={props.onClose}
      overlayProps={{
        backgroundOpacity: 0.04,
        blur: 0.5,
      }}
      classNames={{
        root: 'flex flex-col',
        body: 'bg-[#FAFBFF]',
      }}
      transitionProps={{ duration: 0 }}
      withCloseButton={false}
      onKeyUp={(event) => {
        if (event.key === 'Enter') {
          removeEffect();
        }
      }}
    >
      <FocusTrap.InitialFocus />

      <p className="text-lg font-medium text-wrap whitespace-pre-wrap">
        Are you sure you want to delete '{props.note.name}'?
      </p>
      <p className="text-sm mb-2">This action cannot be undone.</p>

      <div className="flex flex-row space-x-4 mt-5 w-full justify-end">
        <Button
          size="sm"
          variant="outline"
          classNames={{
            root: 'w-fit min-w-[28%]',
          }}
          onClick={props.onClose}
        >
          Cancel
        </Button>
        <Button
          onClick={removeEffect}
          size="sm"
          classNames={{
            root: 'w-fit min-w-[28%]',
          }}
        >
          Remove
          <span className="text-white text-center font-bold ml-[10px] border-[1px] border-solid border-white/20 bg-white/10 pl-[7px] pr-[9px] pt-[2.5px] pb-[1.5px] rounded">
            ⏎
          </span>
        </Button>
      </div>
    </Modal>
  );
};
