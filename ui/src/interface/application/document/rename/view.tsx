import { TextInput } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useEffect, type ChangeEvent } from 'react';

import { type Document } from 'core/src/domain/document/types';

import { documentRenamingModel } from './model';

export const Name = observer((doc: Document) => {
  const process = documentRenamingModel.process;

  const inputNodeRef = useClickOutside(() => {
    documentRenamingModel.apply.run();
  });

  const start = async () => {
    const processing = Boolean(process);
    if (processing) {
      await documentRenamingModel.apply.run();
    }

    documentRenamingModel.start(doc);
  };
  const update = (event: ChangeEvent<HTMLInputElement>) => {
    documentRenamingModel.update({ name: event.currentTarget.value });
  };

  useEffect(() => {
    if (process && inputNodeRef.current) {
      const caretPosition = process.initial.length;
      inputNodeRef.current.setSelectionRange(caretPosition, caretPosition);
    }
  }, [process?.id]);

  if (process?.id === doc.id) {
    return (
      <TextInput
        ref={inputNodeRef}
        value={process.input}
        onChange={update}
        onKeyDown={async (event) => {
          if (event.key === 'Escape' || event.key === 'Enter') {
            await documentRenamingModel.apply.run();
          }
        }}
        classNames={{
          input:
            'leading-4 text-center focus:border-black/20 focus border-solid max-w-[15.5rem] w-[15.5rem] text-sm min-h-0 h-[1.48rem] px-2 rounded',
        }}
        size="xs"
        autoFocus
      />
    );
  } else {
    return (
      <div
        className="text-sm flex items-center h-[1.48rem] w-[15.5rem] max-w-[15.5rem] hover:border-dashed hover:border-spacing-4 hover:border-[1px] border-gray-400/45 box-border rounded-sm truncate px-2 hover:px-[7px]"
        onClick={start}
      >
        <span className="leading-4 truncate text-center w-full">{doc.name}</span>
      </div>
    );
  }
});
