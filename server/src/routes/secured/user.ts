import { Router } from 'express'
import UserAuthController from '../../controllers/rest/UserController'

const router = Router()

router.post('/add-avatar', UserAuthController.uploadAvatar)
router.delete('/remove-avatar/:fileKey', UserAuthController.deleteAvatar)

export default router
