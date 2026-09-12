import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import validate from '../middleware/validate.js'
import { createUserSchema, createStoreSchema } from '../utils/validators.js'
import { ROLES } from '../utils/constants.js'
import {
  dashboard, getUsers, createUser, getUser, getStores, addStore,
} from '../controllers/admin.controller.js'

const router = Router()

router.use(requireAuth, requireRole(ROLES.ADMIN))

router.get('/dashboard', dashboard)

router.get('/users', getUsers)
router.post('/users', validate(createUserSchema), createUser)
router.get('/users/:id', getUser)

router.get('/stores', getStores)
router.post('/stores', validate(createStoreSchema), addStore)

export default router
