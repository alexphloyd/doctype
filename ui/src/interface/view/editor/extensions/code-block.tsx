import { ActionIcon, CopyButton } from '@mantine/core';
import { CheckIcon, CopyIcon } from '@radix-ui/react-icons';
import CodeBlock from '@tiptap/extension-code-block';
import {
  NodeViewWrapper,
  NodeViewContent,
  ReactNodeViewRenderer,
  type NodeViewProps,
} from '@tiptap/react';

export const CodeBlockExtended = CodeBlock.extend({
  addKeyboardShortcuts() {
    return {
      Tab: () => {
        if (this.editor.isActive('codeBlock')) {
          const view = this.editor.view;
          view.dispatch(view.state.tr.insertText('  '));
          return true;
        } else {
          return false;
        }
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockComponent);
  },
});

function CodeBlockComponent(props: NodeViewProps) {
  return (
    <NodeViewWrapper as="div">
      <div className="relative">
        <CopyButton value={props.node.textContent} timeout={2000}>
          {({ copied, copy }) => (
            <ActionIcon
              radius="sm"
              color={copied ? 'teal' : 'gray'}
              variant="transparent"
              onClick={copy}
              className="absolute top-[4px] right-[4px]"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </ActionIcon>
          )}
        </CopyButton>
        <pre>
          <NodeViewContent as="code" />
        </pre>
      </div>
    </NodeViewWrapper>
  );
}
