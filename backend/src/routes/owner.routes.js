import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { ROLES } from '../utils/constants.js'
import { dashboard } from '../controllers/owner.controller.js'

const router = Router()

router.use(requireAuth, requireRole(ROLES.OWNER))

router.get('/dashboard', dashboard)

export default router
