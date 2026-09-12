import { Router } from 'express'
import validate from '../middleware/validate.js'
import { loginSchema, registerSchema ,updatePasswordSchema} from '../utils/validators.js'
import { register,login,logout,me,updatePassword } from '../controllers/auth.controller.js'
import { requireAuth } from '../middleware/auth.js'
import { authLimiter } from '../middleware/rateLimit.js'

const router = Router()

router.post('/register',authLimiter, validate(registerSchema), register)
router.post('/login',authLimiter, validate(loginSchema), login)
router.post('/logout', logout)
router.get('/me', requireAuth, me) 
router.patch('/password', requireAuth, validate(updatePasswordSchema), updatePassword)


export default router
