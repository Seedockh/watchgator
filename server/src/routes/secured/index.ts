import { Router } from 'express'
import user from './user'
import userFilmography from './userFilmography'

const routes: Router = Router()

routes.use('/user', user)
routes.use('/user/movies', userFilmography)

export default routes
