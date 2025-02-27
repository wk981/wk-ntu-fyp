import { z } from 'zod';

const confirmPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
      .regex(/[a-z]/, 'Password must include at least one lowercase letter')
      .regex(/[0-9]/, 'Password must include at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must include at least one special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'], // path of error
  });

const usernameSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
});

const passwordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
    .regex(/[a-z]/, 'Password must include at least one lowercase letter')
    .regex(/[0-9]/, 'Password must include at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must include at least one special character'),
});

const emailSchema = z.object({
  email: z.string().email('This is not a valid email').min(1, { message: 'This field has to be filled.' }),
});

export const loginFormSchema = z.intersection(usernameSchema, passwordSchema);

const standardRegisterSchema = z.intersection(usernameSchema, confirmPasswordSchema);

export const registerFormSchema = z.intersection(standardRegisterSchema, emailSchema);

export const userEmailFormSchema = z.intersection(usernameSchema, emailSchema);

const passwordValidation = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
  .regex(/[a-z]/, 'Password must include at least one lowercase letter')
  .regex(/[0-9]/, 'Password must include at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must include at least one special character');

export const changePasswordSchema = z
  .object({
    currentPassword: passwordValidation,
    password: passwordValidation,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const emailValidator = z.string().email();

export const optionalUserEmailFormSchema = z
  .object({
    email: z.string().refine((v) => (v ? emailValidator.safeParse(v).success : true), 'Invalid email'),
    username: z.string().min(3).optional(),
  })
  .partial()
  .refine(({ email, username }) => email || username, {
    message: 'At least one field should be provided (or both).',
  });

export interface User {
  id: number;
  email: string;
  username: string;
  role: string[];
  pic: string;
  isCareerPreferenceSet: boolean;
}

export interface UpdateProfileRequest {
  userId: number;
  newEmail: string;
  newUsername: string;
}

export interface FormProps {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface UpdatePasswordRequest {
  userId: number;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
