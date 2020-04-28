import { Router } from 'express'
import MoviesController from '../controllers/rest/MoviesController'

const router = Router()

router.get('/all', MoviesController.getAll)
router.get('/all/:page', MoviesController.getAllByPage)
router.get('/title/:string', MoviesController.getTitle)

export default router
