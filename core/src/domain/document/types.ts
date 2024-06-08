import { User } from '@prisma/client';

export type Document = {
    id: string;
    userId?: User['id'] | null | undefined;

    creationDate: string;

    title: string;
};
