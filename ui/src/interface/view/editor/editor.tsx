import { type EditorEvents, EditorProvider } from '@tiptap/react';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { DocumentSourceModel } from '~/interface/application/document/edit/model';
import { debounce } from '~/interface/shared/lib/debounce';

import { extensions } from './extensions/extensions.config';
import './styles.css';
import { EditorToolbar } from './toolbar';

interface Props {
  documentSourceModel: DocumentSourceModel;
}

export const EditorView = observer(({ documentSourceModel }: Props) => {
  const handleUpdate = debounce((event: EditorEvents['update']) => {
    documentSourceModel.updateSource.run(event.editor.getJSON());
  }, 800);

  if (documentSourceModel.init.meta.status !== 'fulfilled') {
    return null;
  }

  return (
    <EditorProvider
      autofocus
      content={documentSourceModel.source}
      extensions={extensions}
      onUpdate={handleUpdate}
    >
      <EditorToolbar />
    </EditorProvider>
  );
});
