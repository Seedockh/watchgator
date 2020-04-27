import { Router } from 'express'
import MoviesController from '../controllers/rest/MoviesController'

const router = Router()

router.get('/all', MoviesController.getAll)

export default router
