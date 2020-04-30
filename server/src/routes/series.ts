import { Router } from 'express'
import SeriesController from '../controllers/rest/SeriesController'

const router = Router()

router.get('/all', SeriesController.getAll)
router.get('/all/:page', SeriesController.getAllByPage)
router.get('/:id', SeriesController.getById)
router.post('/find', SeriesController.findByKeys)

export default router
