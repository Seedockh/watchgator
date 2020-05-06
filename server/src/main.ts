/** ****** INTERNALS ****** **/
import './prelude'
import './postlude'
import { sLog } from './core/Log'
import Scraper from './core/Scraper'
import IMDBDatasetService from './services/IMDBDatasetService'
import Database from './database/Database'
import UserRepository from './database/repositories/UserRepository'
import UserMoviesRepository from './database/repositories/UserMoviesRepository'
import ExpressServer from './core/ExpressServer'
import 'reflect-metadata'

(async () => {
	await Database.boot()
	if (process.env.NODE_ENV !== 'production') await Scraper.boot('sample')
	UserRepository.instance.init()
	UserMoviesRepository.instance.init()
	ExpressServer.run()
	if (process.env.NODE_ENV !== 'production') await IMDBDatasetService.init()
})()

if (process.env.NODE_ENV === 'production')
try {
	IMDBDatasetService.init()
} catch (err) {
	sLog(err, '#FF0000')
}
