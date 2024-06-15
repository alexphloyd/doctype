import { RichTextEditor, Link } from '@mantine/tiptap';
import { Node } from '@tiptap/core';
import { mergeAttributes } from '@tiptap/core';
import Highlight from '@tiptap/extension-highlight';
import SubScript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
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

const initialNodes = [
    { id: '1', position: { x: 0, y: 0 }, data: { label: 'router' } },
    { id: '2', position: { x: 120, y: 100 }, data: { label: 'network' } },
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
        <div className="min-h-[30vh] h-[30vh] w-full">
            <ReactFlow
                id={crypto.randomUUID()}
                nodes={nodes}
                onNodesChange={onNodesChange}
                edges={edges}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                fitViewOptions={{ padding: 0.7 }}
            >
                <Background />
            </ReactFlow>
        </div>
    );
};

const SchemaNode = Node.create({
    name: 'schema',
    group: 'block',

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

    addNodeView() {
        return ReactNodeViewRenderer(FlowComponent);
    },
});

export const Editor = () => {
    return <Demo />;
};

const content = `<schema></schema>
<p style="text-align: center;"><em>Little Stupid Document</em></p>
<p>This is an example of content for a tiptap editor. We will include some text, lists, and more to demonstrate how it can be structured.</p>

<h2>Introduction</h2>
<p>Welcome to the example document. Below are some lists and more content to illustrate the structure.</p>

<h3>Unordered List</h3>
<ul>
  <li>First item in the list</li>
  <li>Second item in the list</li>
  <li>Third item in the list</li>
</ul>

<h3>Ordered List</h3>
<ol>
  <li>First item in the list</li>
  <li>Second item in the list</li>
  <li>Third item in the list</li>
</ol>

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
                    root: 'w-full max-w-[800px] mx-4 min-h-[95vh] border-borderDark',
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

                <RichTextEditor.Content />
            </RichTextEditor>
        </>
    );
}
