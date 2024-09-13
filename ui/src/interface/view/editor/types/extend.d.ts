import '@tiptap/core';
import '@tiptap/react';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    toggleLinkModal: {
      toggleLinkModal: () => ReturnType;
    };
    openLinkModal: {
      openLinkModal: () => ReturnType;
    };
    closeLinkModal: {
      closeLinkModal: () => ReturnType;
    };
  }

  interface EditorOptions {
    onToggleLinkModal?: () => void;
  }
}
