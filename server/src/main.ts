/** ****** INTERNALS ****** **/
import './prelude'
import './postlude'
import Scraper from './core/Scraper'
import IMDBDatasetService from './services/IMDBDatasetService'
import Database from './database/Database'
import UserRepository from './database/repositories/UserRepository'
import UserMoviesRepository from './database/repositories/UserMoviesRepository'
import ExpressServer from './core/ExpressServer'
import 'reflect-metadata'
;(async () => {
	await Database.boot()
	if (process.env.NODE_ENV !== 'production') await Scraper.boot('sample')
	UserRepository.instance.init()
	UserMoviesRepository.instance.init()
	await IMDBDatasetService.init()
	ExpressServer.run()
})()
