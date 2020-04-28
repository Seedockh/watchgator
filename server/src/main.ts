/** ****** INTERNALS ****** **/
import './prelude'
import './postlude'
import Scraper from './core/Scraper'
import IMDBService from './services/IMDBService'
import Database from './database/Database'
import UserRepository from './database/repositories/UserRepository'
import ExpressServer from './core/ExpressServer'

(async () => {
	await Scraper.boot('sample')
	await IMDBService.init()
	await Database.boot()
	await UserRepository.init()
	await ExpressServer.run()
})()
