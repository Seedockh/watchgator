/** ****** INTERNALS ****** **/
import './prelude'
import './postlude'
import ExpressServer from './core/ExpressServer'
import Database from './database/Database'
import UserRepository from './database/repositories/UserRepository'

(async () => {
	await Database.boot()
	await UserRepository.init()
	await ExpressServer.run()
})
