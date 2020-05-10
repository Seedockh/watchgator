import { Router } from 'express'
import SeriesController from '../controllers/rest/SeriesController'

const router = Router()

router.get('/all/:page?', SeriesController.getAll)
router.get('/:id', SeriesController.getById)
router.post('/find', SeriesController.findByKeys)

export default router
