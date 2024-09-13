import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import StarterKit from '@tiptap/starter-kit';
import css from 'highlight.js/lib/languages/css';
import go from 'highlight.js/lib/languages/go';
import python from 'highlight.js/lib/languages/python';
import rust from 'highlight.js/lib/languages/rust';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import { all, createLowlight } from 'lowlight';

import { CodeBlockExtended } from './code-block';
import { DocumentExtended } from './document';
import { TaskItemExtended, TaskListExtended } from './task-list';

const lowlight = createLowlight(all);

lowlight.register('html', html);
lowlight.register('css', css);
lowlight.register('ts', ts);
lowlight.register('python', python);
lowlight.register('rust', rust);
lowlight.register('go', go);

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
