import { z } from 'zod';

export const updateProfileSchema = z
  .object({
    name: z.string().max(255).optional(),
    email: z.email().optional(),
    password: z.string().min(8).optional(),
    password_confirmation: z.string().optional(),
  })
  .refine(
    (data) => !data.password || data.password === data.password_confirmation,
    { message: 'パスワードが一致しません', path: ['password_confirmation'] }
  );

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
