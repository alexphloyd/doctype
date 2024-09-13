import { EditorProvider } from '@tiptap/react';

import { extensions } from './extensions/extensions.config';
import './styles.css';
import { EditorToolbar } from './toolbar';

interface Props {
  source: Record<string, unknown>;
}

export function Editor(props: Props) {
  const { source } = props;

  return (
    <EditorProvider autofocus extensions={extensions} content={source}>
      <EditorToolbar />
    </EditorProvider>
  );
}
