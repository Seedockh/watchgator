import './prelude'
import './postlude'
import ExpressServer from './core/ExpressServer'
import { createConnection } from 'typeorm'
import DbConfig from './core/DbConfig'

createConnection(DbConfig)
	.then(() => {
		ExpressServer.run()
	})
	.catch(error => console.log(error))
