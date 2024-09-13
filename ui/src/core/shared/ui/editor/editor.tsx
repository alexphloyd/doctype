import { EditorProvider } from '@tiptap/react';
import { type Source } from 'core/src/domain/document/types';

import './editor-content.css';
import { extensions } from './extensions/extensions.config';
import { EditorToolbar } from './toolbar';

interface Props {
  source: Source;
}

export function Editor(props: Props) {
  const { source } = props;

  return (
    <EditorProvider autofocus extensions={extensions} content={source}>
      <EditorToolbar />
    </EditorProvider>
  );
}
