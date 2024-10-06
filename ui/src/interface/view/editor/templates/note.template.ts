import dayjs from 'dayjs';

import { type Note } from 'core/src/domain/note/types';

export const getNoteTemplate = ({ name, date }: { name: Note['name']; date: string }) => {
  return `
    <h1>${name}</h1><p>The note was created at ${dayjs(date).format('dddd h:mm A').toString()}</p>
  `;
};
