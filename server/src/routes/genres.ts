import { Router } from 'express'
import GenresController from '../controllers/rest/GenresController'

const router = Router()

router.get('/all', GenresController.getAll)

export default router
