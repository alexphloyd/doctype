import { EditorProvider } from '@tiptap/react';
import { type Source } from 'core/src/domain/document/types';

import { config } from './config/editor.config';
import './editor-content.css';
import { extensions } from './extensions/extensions.config';
import { EditorToolbar } from './toolbar';

interface Props {
  source: Source;
}

export function Editor(props: Props) {
  const { source } = props;

  return (
    <EditorProvider
      autofocus
      slotAfter={<EditorToolbar />}
      extensions={extensions}
      content={source}
      editorProps={config.editorProps}
    />
  );
}
