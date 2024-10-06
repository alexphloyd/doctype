import { CloseButton, Paper } from '@mantine/core';
import { useDisclosure, useHover } from '@mantine/hooks';
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import { type MouseEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';
import { preparePreview } from '~/interface/shared/lib/prepate-preview';
import { Icon } from '~/interface/shared/view/icon';

import { type Document } from 'core/src/domain/document/types';

import { Name } from '../../rename/view';
import './preview.css';
import { RemoveModal } from './remove.modal';

export const Preview = observer((props: Document) => {
  const navigate = useNavigate();

  const { ref: paperRef, hovered } = useHover();
  const [removeModalOpened, { open: _openRemoveModal, close: closeRemoveModal }] =
    useDisclosure(false);

  const openNote = () => {
    navigate('/notes/' + props.id);
  };

  const openRemoveModal: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    _openRemoveModal();
  };

  return (
    <li className="flex flex-col items-center">
      <Paper
        ref={paperRef}
        withBorder={hovered}
        onClick={openNote}
        shadow="xs"
        classNames={{
          root: 'overflow-hidden min-w-[15.6rem] min-h-[11.5rem] h-[11.5rem] max-w-[15.6rem] max-h-[11.5rem] mb-[7px] cursor-pointer relative border-solid border-[1px] border-borderLight/35 hover:border-borderDark/80 overflow-hidden px-3 pt-2 py-[6px]',
        }}
      >
        <div
          className="tiptap-preview"
          dangerouslySetInnerHTML={{ __html: preparePreview(props.source) }}
        />

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

      <Name {...props} key={props.id} />
      <span className="mt-[0.5px] text-[0.7rem] text-fontSecondary">
        {dayjs(props.lastUpdatedTime).format('D MMMM h:mm A').toString()}
      </span>

      <RemoveModal doc={props} opened={removeModalOpened} onClose={closeRemoveModal} />
    </li>
  );
});
