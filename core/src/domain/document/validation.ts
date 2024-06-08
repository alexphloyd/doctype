import { z } from 'zod';

export const DocumentSchema = z.object({
    id: z.string(),
    userId: z.number().nullish(),
    creationDate: z.string(),
    title: z.string(),
});

export const DocumentStrictSchema = DocumentSchema.omit({ userId: true }).extend({
    userId: z.string(),
});
