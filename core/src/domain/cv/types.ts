import { User } from '@prisma/client';

export type Cv = {
    id: string;
    userId?: User['id'] | null | undefined;

    creationDate: string;

    title: string;
};
