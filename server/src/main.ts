/** ****** INTERNALS ****** **/
import './prelude'
import './postlude'
import Scraper from './core/Scraper'
import IMDBDatasetService from './services/IMDBDatasetService'
import Database from './database/Database'
import UserRepository from './database/repositories/UserRepository'
import ExpressServer from './core/ExpressServer'

(async () => {
	await Database.boot()
	if (process.env.NODE_ENV !== 'production') await Scraper.boot('sample')
	await UserRepository.init()
	await IMDBDatasetService.init()
	await ExpressServer.run()
})()
