import { Router } from 'express'
import PeoplesController from '../controllers/rest/PeoplesController'

const router = Router()

router.get('/all/:page?', PeoplesController.getAll)
router.get('/:id', PeoplesController.getById)
router.post('/find', PeoplesController.findByKeys)

export default router
