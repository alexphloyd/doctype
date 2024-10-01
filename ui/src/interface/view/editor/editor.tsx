import { EditorContent, type EditorEvents, useEditor } from '@tiptap/react';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect } from 'react';
import { DocumentSourceModel } from '~/interface/application/document/source/model';
import { router } from '~/interface/kernel/router/mod.router';
import { debounce } from '~/interface/shared/lib/debounce';

import { extensions } from './extensions/extensions.config';
import './styles.css';
import { EditorToolbar } from './toolbar';

interface Props {
  documentSourceModel: DocumentSourceModel;
}

export const EditorView = observer(({ documentSourceModel }: Props) => {
  const handleUpdate = useCallback(
    debounce((event: EditorEvents['update']) => {
      documentSourceModel.updateSource.run(event.editor.getHTML());
    }, 700),
    []
  );

  const editor = useEditor({
    content: documentSourceModel.source,
    extensions: extensions,
    onUpdate: handleUpdate,
  });

  useEffect(() => {
    editor?.commands.setContent(documentSourceModel.source);
  }, [documentSourceModel.source]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        router.navigate('/');
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  if (documentSourceModel.init.meta.status !== 'fulfilled') {
    return null;
  }

  return (
    <>
      <EditorContent editor={editor} />
      <EditorToolbar editor={editor} />
    </>
  );
});
