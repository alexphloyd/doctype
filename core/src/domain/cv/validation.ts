import { z } from 'zod';

export const CvSchema = z.object({
    id: z.string(),
    userId: z.number().nullish(),
    creationDate: z.string(),
    title: z.string(),
});

export const CvStrictSchema = CvSchema.omit({ userId: true }).extend({
    userId: z.string(),
});
