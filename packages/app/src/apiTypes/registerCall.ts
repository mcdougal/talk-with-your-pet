import { z } from 'zod';

export const RegisterCallResponseSchema = z.object({
  call: z.object({
    id: z.string(),
    sampleRate: z.number(),
  }),
});

export type RegisterCallResponse = z.infer<typeof RegisterCallResponseSchema>;
