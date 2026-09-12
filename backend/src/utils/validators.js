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

export const registerSchema = z.object({
  name: nameRule,
  email: emailRule,
  address: addressRule,
  password: passwordRule,
})

export const loginSchema = z.object({
  email: emailRule,
  password: z.string().min(1, 'Password is required'),
})

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordRule,
})

export const storeQuerySchema = z.object({
  search: z.string().trim().catch(''),
  sortBy: z.enum(['name', 'address', 'rating']).catch('name'),
  order: z.enum(['asc', 'desc']).catch('asc'),
})

export const ratingSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be 1 to 5').max(5, 'Rating must be 1 to 5'),
})

export const idSchema = z.uuid()

const roleRule = z.enum(Object.values(ROLES), 'Role must be ADMIN, USER or OWNER')

export const createUserSchema = registerSchema.extend({
  role: roleRule,
})

export const userQuerySchema = z.object({
  name: z.string().trim().catch(''),
  email: z.string().trim().catch(''),
  address: z.string().trim().catch(''),
  role: roleRule.optional().catch(undefined),
  sortBy: z.enum(['name', 'email', 'address', 'role']).catch('name'),
  order: z.enum(['asc', 'desc']).catch('asc'),
})

export const storeAdminQuerySchema = z.object({
  name: z.string().trim().catch(''),
  email: z.string().trim().catch(''),
  address: z.string().trim().catch(''),
  sortBy: z.enum(['name', 'email', 'address', 'rating']).catch('name'),
  order: z.enum(['asc', 'desc']).catch('asc'),
})

export const createStoreSchema = z.object({
  name: nameRule,
  email: emailRule,
  address: addressRule,
  ownerId: z.uuid('Invalid owner id').optional(),
})
