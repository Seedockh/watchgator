import { Request, Response, Router } from 'express'
import auth from './auth'
import movies from './movies'
import series from './series'
import peoples from './peoples'
import genres from './genres'
import secured from './secured/'
import passport from 'passport'

const api = Router()

api.get('/', (req: Request, res: Response) => {
	res.status(200).json({ hello: "Now we're talking. Make this API rock ! 🚀" })
})

api.use('/auth', auth)
api.use('/movies', movies)
api.use('/series', series)
api.use('/peoples', peoples)
api.use('/genres', genres)

api.use('/', passport.authenticate('jwt', { session: false }), secured)

export default api
