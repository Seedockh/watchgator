import { Router } from 'express'
import PeoplesController from '../controllers/rest/PeoplesController'

const router = Router()

router.get('/all/:page?', PeoplesController.getAll)
router.get('/:id', PeoplesController.getById)
router.get('/:id/movies', PeoplesController.getMovies)
router.get('/:id/series', PeoplesController.getSeries)
router.post('/find', PeoplesController.findByKeys)

export default router
