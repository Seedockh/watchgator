/** ****** EXPRESS ****** **/
import { Router } from 'express'
/** ****** INTERNALS ****** **/
import UserController from '../../controllers/rest/UserController'

const router = Router()

router.get('/get/:uuid', UserController.getUser)
router.post('/add-movie', UserController.addMovie)
router.put('/update', UserController.updateUser)
router.put('/update-password', UserController.updateUserPwd)
router.put('/update-avatar', UserController.updateAvatar)
router.delete('/delete/:uuid', UserController.deleteUser)
router.delete('/delete-avatar/:fileKey', UserController.deleteAvatar)

export default router
