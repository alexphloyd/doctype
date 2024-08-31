import { type EditorProviderProps } from '@tiptap/react';

export const config = {
  editorProps: {
    handleKeyDown(view, event) {
      if (event.code === 'Tab') {
        event.preventDefault();
        view.dispatch(view.state.tr.insertText('  '));
        return true;
      }
      return false;
    },
  },
} satisfies EditorProviderProps;
