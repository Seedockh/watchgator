/** ****** SERVER ****** **/
import express, { Application, Express, Request, Response } from 'express'
import { Server } from 'http'
/** ****** INTERNALS ****** **/
import api from '../routes'
import Middleware from '../routes/middlewares/Middleware'
import { sLog } from './Log'

class ExpressServer {
	// server | api instance
	private app: Application = express()
	private server: Server = new Server(this.app)

	public run(): void {
		const { PORT: port } = process.env
		// define default root
		this.app.get('/', (req: Request, res: Response) => {
			res.send('Welcome on your app root endpoint ! Try to get /api now :)')
		})
		// use Middlewares on app
		Middleware(this.app)
		// use routes
		this.app.use('/api', api)
		// open server
		this.server.listen(port, () => {
			sLog(`💫 Server is running on http://localhost:${port}`)
		})
	}
}

export default Object.freeze(new ExpressServer())
