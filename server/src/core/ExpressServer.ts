import express, { Express, Request, Response } from 'express'
import { Server } from 'http'
import chalk from 'chalk'
import api from '../routes'
import { Middlewares } from './middlewares'

// server | api instance
const app: Express = express()

// define default root
app.get('/', (req: Request, res: Response) => {
	res.send('Welcome on your app root endpoint ! Try to get /api now :)')
})
// use Middlewares on app
Middlewares(app)
// use routes
app.use('/api', api)

function startApp() {
	const { PORT: port } = process.env
	const server: Server = new Server(app)
	// open server
	server.listen(port, () => {
		console.log(
			chalk.bold.magenta(`💫  Server is running on http://localhost:${port}`),
		)
	})
}
export { app }
export default startApp
