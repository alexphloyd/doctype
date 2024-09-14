import { z } from 'zod';

import { SignUpDto, VerificationDto } from 'core/src/domain/auth/validation';

export const SignUpSchema = SignUpDto.extend({
  confirm: z.string().min(6, { message: 'Password confirmation must be longer' }),
}).superRefine(({ password, confirm }, ctx) => {
  if (password !== confirm) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Password don't match`,
      path: ['confirm'],
    });
  }
});

export const VerificationSchema = VerificationDto.pick({
  code: true,
});
