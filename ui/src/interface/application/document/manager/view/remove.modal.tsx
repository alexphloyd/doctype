import { Button, FocusTrap, Modal } from '@mantine/core';

import { type Document } from 'core/src/domain/document/types';

import { documentManagerModel } from '../model';

interface Props {
  opened: boolean;
  onClose: () => void;
  doc: Document;
}

export const RemoveModal = (props: Props) => {
  const removeEffect = () => {
    documentManagerModel.remove.run({ id: props.doc.id });
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
        Are you sure you want to delete '{props.doc.name}'?
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
          <span className="text-white text-center font-bold ml-3 border-[1px] border-solid border-white/20 bg-white/10 px-[6px] py-[2.5px] rounded">
            ⏎
          </span>
        </Button>
      </div>
    </Modal>
  );
};
