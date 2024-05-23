import { z } from 'zod';

export const CvDto = z.object({
    id: z.string(),
    userId: z.string().nullish(),
    creationDate: z.string(),
    title: z.string(),
});
