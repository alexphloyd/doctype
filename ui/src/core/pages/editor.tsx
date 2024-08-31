import { Editor as EditorView } from '~/core/shared/ui/editor/editor';

import { DEMO_CONTENT } from '../shared/ui/editor/demo-content.const';

export const Editor = () => {
  return (
    <main className="flex w-full px-[1%] lg:px-[2%] items-center justify-center relative">
      <EditorView source={DEMO_CONTENT} />
    </main>
  );
};
