/** ****** EXPRESS ****** **/
import { Router } from 'express'
/** ****** INTERNALS ****** **/
import UserMoviesController from '../../controllers/rest/UserMoviesController'

const router = Router()

router.get('/get', UserMoviesController.getCollection)
router.post('/post/:mediaId', UserMoviesController.addToCollection)

export default router
