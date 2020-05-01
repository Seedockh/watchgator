import { Router } from 'express'
import SearchController from '../controllers/rest/SearchController'

const router = Router()

router.post('/', SearchController.search)

export default router
