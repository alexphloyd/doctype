import { CloseButton, Paper } from '@mantine/core';
import { useDisclosure, useHover } from '@mantine/hooks';
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import { type MouseEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '~/interface/shared/view/icon';

import { type Document } from 'core/src/domain/document/types';

import { Name } from '../../rename/view';
import { RemoveModal } from './remove.modal';

export const Preview = observer((doc: Document) => {
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
