import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import StarterKit from '@tiptap/starter-kit';

import { CodeBlockExtended } from './code-block';
import { DocumentExtended } from './document';
import { lowlight } from './lowlight';
import { TaskItemExtended, TaskListExtended } from './task-list';

export const extensions = [
  DocumentExtended,
  StarterKit.configure({ codeBlock: false, document: false }),

  TaskListExtended,
  TaskItemExtended.configure({
    nested: true,
  }),

  CodeBlockExtended,
  CodeBlockLowlight.configure({
    lowlight,
  }),
];
