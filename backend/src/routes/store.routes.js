import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { getStores } from '../controllers/store.controller.js'

const router = Router()

router.get('/', requireAuth, getStores)

export default router
