import { z } from 'zod'
import { ROLES } from './constants.js'

export const nameRule = z.string().trim()
  .min(20, 'Name must be at least 20 characters')
  .max(60, 'Name must be at most 60 characters')

export const emailRule = z.email('Invalid email address')

export const addressRule = z.string().trim()
  .min(1, 'Address is required')
  .max(400, 'Address must be at most 400 characters')

export const passwordRule = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(16, 'Password must be at most 16 characters')
  .regex(/[A-Z]/, 'Password needs at least one uppercase letter')
  .regex(/[^A-Za-z0-9]/, 'Password needs at least one special character')

export const loginSchema = z.object({
  email: emailRule,
  password: z.string().min(1, 'Password is required'),
})

export const signupSchema = z.object({
  name: nameRule,
  email: emailRule,
  address: addressRule,
  password: passwordRule,
})
export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordRule,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const createUserSchema = signupSchema.extend({
  role: z.enum(Object.values(ROLES), 'Please choose a role'),
})

