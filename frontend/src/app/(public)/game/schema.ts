import { z } from 'zod';

export const schema = z.object({
  name: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  mode: z.enum(['single', 'multi']),
});