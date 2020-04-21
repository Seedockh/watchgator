import { Request, Response, Router } from 'express'
//import scraper from './scraper'

const api = Router()

api.get('/', (req: Request, res: Response) => {
	res.status(200).json({ hello: "Now we're talking. Make this API rock ! 🚀" })
})

//api.use('/scraper', scraper)

export default api
