import './prelude'
import './postlude'
import startApp from './core/ExpressServer'
import { createConnection } from 'typeorm'
import DbConfig from './core/DbConfig'

createConnection(DbConfig)
	.then(() => {
		startApp()
	})
	.catch(error => console.log(error))
