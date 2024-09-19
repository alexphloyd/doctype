import { User } from '@prisma/client';

export type Document = {
    id: string;
    userId?: User['id'] | null | undefined;

    lastUpdatedTime: string;

    name: string;

    source: Source;
};

export type Source = string;
