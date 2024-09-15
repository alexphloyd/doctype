import { z } from 'zod';

export const DocumentSchema = z.object({
    id: z.string(),
    userId: z.number().nullish(),
    lastUpdatedTime: z.string(),
    name: z.string(),
    source: z.record(z.any()),
});

export const DocumentStrictSchema = DocumentSchema.omit({ userId: true }).extend({
    userId: z.string(),
});
