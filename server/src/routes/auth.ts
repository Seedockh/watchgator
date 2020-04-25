import { Router } from 'express'
import RestAuthController from '../controllers/rest/AuthController'

const router = Router()

router.post('/signup', RestAuthController.signup)
router.post('/signin', RestAuthController.signin)

export default router
