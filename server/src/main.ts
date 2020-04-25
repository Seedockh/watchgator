/** ****** INTERNALS ****** **/
import './prelude'
import './postlude'
import ExpressServer from './core/ExpressServer'
import Database from './database/Database'
import UserRepository from './database/repositories/UserRepository'
import Scraper from './core/Scraper'

(async () => {
	await Scraper.boot()
	await Database.boot()
	await UserRepository.init()
	await ExpressServer.run()
})()
