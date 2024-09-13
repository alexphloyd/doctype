import { DEMO_CONTENT } from '../view/editor/demo-content.const';
import { Editor as EditorView } from '../view/editor/editor';

export const Editor = () => {
  return (
    <main className="flex w-full px-[1%] lg:px-[2%] items-center justify-center relative">
      <EditorView source={DEMO_CONTENT} />
    </main>
  );
};
