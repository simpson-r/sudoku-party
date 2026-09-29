import { z } from 'zod';

export const schema = z.object({
  name: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});
