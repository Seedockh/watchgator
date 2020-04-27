import { Router } from 'express'
import user from './user'

const routes: Router = Router()

routes.use('/user', user)

export default routes
