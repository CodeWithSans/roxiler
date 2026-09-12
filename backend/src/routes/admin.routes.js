import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { ROLES } from '../utils/constants.js'
import { dashboard } from '../controllers/admin.controller.js'

const router = Router()

router.use(requireAuth, requireRole(ROLES.ADMIN))

router.get('/dashboard', dashboard)

export default router
