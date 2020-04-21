import { Request, Response, Router } from 'express'

const routes: Router = Router()

routes.get('/', (req: Request, res: Response) => {
	res.status(200).json({ hello: 'You are in protected routes ! 🚀' })
})

export default routes
