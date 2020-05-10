/** ****** INTERNALS ****** **/
import './prelude'
import './postlude'
import Database from './database/Database'
import UserRepository from './database/repositories/UserRepository'
import UserMoviesRepository from './database/repositories/UserMoviesRepository'
import Imdb from './database/Imdb'
import ExpressServer from './core/ExpressServer'
import 'reflect-metadata'

(async () => {
	await Imdb.boot()
	await Database.boot()
	UserRepository.instance.init()
	UserMoviesRepository.instance.init()
	ExpressServer.run()
})()
