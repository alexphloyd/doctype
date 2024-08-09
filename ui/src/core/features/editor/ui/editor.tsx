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
    Background,
    Connection,
    EdgeChange,
    NodeChange,
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
} from 'reactflow';

import './styles.css';

const initialNodes = [
    { id: '1', position: { x: 0, y: 0 }, data: { label: 'router' } },
    { id: '2', position: { x: 90, y: 70 }, data: { label: 'service module' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

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
            <div className="h-[150px] my-8 w-full">
                <ReactFlow
                    id={crypto.randomUUID()}
                    nodes={nodes}
                    onNodesChange={onNodesChange}
                    edges={edges}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                    fitViewOptions={{ padding: 0.2 }}
                >
                    <Background />
                </ReactFlow>
            </div>
        </NodeViewWrapper>
    );
};

const Component = () => (
    <NodeViewWrapper>
        <figure data-drag-handle draggable={true} contentEditable={false}>
            drag
        </figure>
        <FlowComponent />
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
<h1 style="text-align: center;"><em>Little Stupid Document</em></h1>
<p>This is an example of content for a tiptap editor. We will include some text, lists, and more to demonstrate how it can be structured.</p>

<h2>Introduction</h2>
<blockquote>Welcome to the example document. Below are some lists and more content to illustrate the structure.</blockquote>

<h4>Unordered List</h3>
<ul>
  <li>First item in the list</li>
  <li>Second item in the list</li>
  <li>Third item in the list</li>
</ul>

<schema></schema>

<h2>Conclusion</h2>
<p>Thank you for reading this example document. The tiptap editor allows for rich text editing with various elements, including lists, headings, and more.</p>
`;

function Demo() {
    // const [items, setItems] = useState([{ id: '1' }, { id: '2' }, { id: '3' }]);
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
                    root: 'w-full max-w-[800px] mx-4 min-h-[95vh] h-[95vh] border-borderDark',
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
