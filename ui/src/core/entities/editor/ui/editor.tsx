import { RichTextEditor, Link } from '@mantine/tiptap';
import { Node } from '@tiptap/core';
import { mergeAttributes } from '@tiptap/core';
import Highlight from '@tiptap/extension-highlight';
import SubScript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { NodeViewWrapper, useEditor } from '@tiptap/react';
import { ReactNodeViewRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useCallback, useState } from 'react';
import ReactFlow, {
  Connection,
  EdgeChange,
  NodeChange,
  SelectionMode,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from 'reactflow';

import './styles.css';

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Module A' } },
  { id: '2', position: { x: 115, y: 95 }, data: { label: 'Module B' } },
  { id: '3', position: { x: -115, y: 95 }, data: { label: 'Module C' } },
];
const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
];

const FlowComponent = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  return (
    <NodeViewWrapper>
      <div className="h-[220px] my-8 w-full">
        <ReactFlow
          id={crypto.randomUUID()}
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
          fitView
          fitViewOptions={{ padding: 0.35 }}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          panOnScroll
          selectionOnDrag
          panOnDrag={[1, 2]}
          selectionMode={SelectionMode.Partial}
        ></ReactFlow>
      </div>
    </NodeViewWrapper>
  );
};

const Component = () => (
  <NodeViewWrapper>
    <main>
      <figure data-drag-handle draggable={true} contentEditable={false}>
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.5 4.625C6.12132 4.625 6.625 4.12132 6.625 3.5C6.625 2.87868 6.12132 2.375 5.5 2.375C4.87868 2.375 4.375 2.87868 4.375 3.5C4.375 4.12132 4.87868 4.625 5.5 4.625ZM9.5 4.625C10.1213 4.625 10.625 4.12132 10.625 3.5C10.625 2.87868 10.1213 2.375 9.5 2.375C8.87868 2.375 8.375 2.87868 8.375 3.5C8.375 4.12132 8.87868 4.625 9.5 4.625ZM10.625 7.5C10.625 8.12132 10.1213 8.625 9.5 8.625C8.87868 8.625 8.375 8.12132 8.375 7.5C8.375 6.87868 8.87868 6.375 9.5 6.375C10.1213 6.375 10.625 6.87868 10.625 7.5ZM5.5 8.625C6.12132 8.625 6.625 8.12132 6.625 7.5C6.625 6.87868 6.12132 6.375 5.5 6.375C4.87868 6.375 4.375 6.87868 4.375 7.5C4.375 8.12132 4.87868 8.625 5.5 8.625ZM10.625 11.5C10.625 12.1213 10.1213 12.625 9.5 12.625C8.87868 12.625 8.375 12.1213 8.375 11.5C8.375 10.8787 8.87868 10.375 9.5 10.375C10.1213 10.375 10.625 10.8787 10.625 11.5ZM5.5 12.625C6.12132 12.625 6.625 12.1213 6.625 11.5C6.625 10.8787 6.12132 10.375 5.5 10.375C4.87868 10.375 4.375 10.8787 4.375 11.5C4.375 12.1213 4.87868 12.625 5.5 12.625Z"
            fill="currentColor"
            fill-rule="evenodd"
            clip-rule="evenodd"
          ></path>
        </svg>
      </figure>
      <FlowComponent />
    </main>
  </NodeViewWrapper>
);

const SchemaNode = Node.create({
  name: 'schema',
  group: 'block',
  atom: true,
  draggable: true,

  parseHTML() {
    return [
      {
        tag: 'schema',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['schema', mergeAttributes(HTMLAttributes)];
  },

  addAttributes() {
    return {
      src: String,
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(Component);
  },
});

export const Editor = () => {
  return <Demo />;
};
const content = `
<h1 style="text-align: center;"><em>Issue Report: Proposal - Safe Assignment Operator</em></h1>
<p>This document outlines an issue regarding the proposed syntax and potential conflicts in the Safe Assignment Operator project.</p>

<h3>Introduction</h3>
<p>During the discussion and review of the proposal for a Safe Assignment Operator, certain concerns were raised about the syntax and its possible conflicts with existing operators. This issue aims to highlight these concerns and propose alternative solutions.</p>

<h4>Issue Details</h4>
<schema>
</schema>

<h4>Issue Points</h4>
<ul>
  <li>Syntax Conflicts: The proposed operator syntax could lead to clashes with existing operators, particularly in complex expressions.</li>
  <li>Ambiguity in Usage: There is a lack of clarity in how the operator would behave under different scenarios, which could result in unintended outcomes.</li>
  <li>Impact on Readability: The operator might decrease code readability, making it harder for developers to understand code at a glance.</li>
</ul>

<h2>Conclusion</h2>
<p>This issue should be addressed before the proposal can move forward. It is recommended to explore alternative syntaxes or revise the proposal to mitigate the outlined concerns. Engaging with the broader developer community to gather feedback may also be beneficial in refining the proposal.</p>
`;

function Demo() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      SchemaNode,
    ],
    content,
  });

  return (
    <>
      <RichTextEditor
        editor={editor}
        classNames={{
          root: 'w-full max-w-[900px] mx-4 border-borderDark relative',
          toolbar: 'border-borderDark',
        }}
      >
        <RichTextEditor.Toolbar sticky>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Highlight />
            <RichTextEditor.Code />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote />
            <RichTextEditor.Hr />
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Subscript />
            <RichTextEditor.Superscript />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignJustify />
            <RichTextEditor.AlignRight />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Undo />
            <RichTextEditor.Redo />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content className="editor-content" />
      </RichTextEditor>
    </>
  );
}
