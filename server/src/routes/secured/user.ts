import { Router } from 'express'
import UserAuthController from '../../controllers/rest/UserController'

const router = Router()

router.get('/get/:uuid', UserAuthController.getUser)
router.put('/update-avatar', UserAuthController.updateAvatar)
router.delete('/remove-avatar/:fileKey', UserAuthController.deleteAvatar)

export default router
