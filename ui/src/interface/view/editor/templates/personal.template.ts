import dayjs from 'dayjs';

import { type Document } from 'core/src/domain/document/types';

export const getNoteTemplate = ({ name, date }: { name: Document['name']; date: string }) => {
  return `
    <h1>${name}</h1><p><em>The note was created at ${dayjs(date).format('dddd h:mm A').toString()}</em></p>
  `;
};
