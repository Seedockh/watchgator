/** ****** EXPRESS ****** **/
import { Router } from 'express'
/** ****** INTERNALS ****** **/
import UserFilmographyController from '../../controllers/rest/UserFilmographyController'

const router = Router()

// router.get('/get', UserFilmographyController.getCollection)
router.put('/put/:mediaId', UserFilmographyController.addToCollection)

export default router
