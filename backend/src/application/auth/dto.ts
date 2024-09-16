import { z } from 'zod';

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email must be longer' })
    .email({ message: 'Email must be valid' }),
  password: z.string().min(6, { message: 'Password must be longer' }),
});

export const SignUpSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email must be longer' })
    .email({ message: 'Email must be valid' }),
  password: z.string().min(6, { message: 'Password must be longer' }),
});

export const VerificationSchema = z.object({
  email: z.string().email(),
  code: z.string().min(6, { message: 'Code must be longer' }),
});
