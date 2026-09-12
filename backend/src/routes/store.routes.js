import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import validate from '../middleware/validate.js'
import { ratingSchema } from '../utils/validators.js'
import { ROLES } from '../utils/constants.js'
import { getStores, submitRating } from '../controllers/store.controller.js'

const router = Router()

router.get('/', requireAuth, getStores)
router.put('/:id/rating', requireAuth, requireRole(ROLES.USER), validate(ratingSchema), submitRating)

export default router
