import { m } from 'framer-motion';
import { useParams } from 'react-router-dom';

import { notesManagerModel } from '../application/note/manager/model';
import { NoteSourceModel } from '../application/note/source/model';
import { router } from '../kernel/router/mod.router';
import { notifications } from '../shared/lib/notifications';
import { EditorView } from '../view/editor/editor';

export const Editor = () => {
  const { noteId } = useParams();

  if (!noteId?.length) {
    router.navigate('/');
    notifications.noteNotFound();

    return <></>;
  }

  return (
    <m.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.12,
        ease: 'easeIn',
      }}
      className="flex w-full px-[1%] lg:px-[2%] items-start justify-center relative min-h-[95vh]"
    >
      <EditorView noteSourceModel={new NoteSourceModel({ id: noteId }, notesManagerModel)} />
    </m.main>
  );
};
