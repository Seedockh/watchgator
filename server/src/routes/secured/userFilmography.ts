/** ****** EXPRESS ****** **/
import { Router } from 'express'
/** ****** INTERNALS ****** **/
import UserFilmographyController from '../../controllers/rest/UserFilmographyController'

const router = Router()

router.get('/get', UserFilmographyController.getCollection)
router.post('/post/:mediaId', UserFilmographyController.addToCollection)

export default router
