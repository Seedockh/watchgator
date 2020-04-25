/** ****** NODE ****** **/
import fs from 'fs'
/** ****** INTERNALS ****** **/
import './prelude'
import './postlude'
import ExpressServer from './core/ExpressServer'
import Database from './database/Database'
import UserRepository from './database/repositories/UserRepository'
import Scraper from './core/Scraper'

(async () => {
	await Database.boot()
	await UserRepository.init()
	await ExpressServer.run()
  
  try {
	// Scraper.scrape() method :
	// °°°°°°°°°°°°°°°°°°°°°°°°°
	// 1st param : the type of the data to scrape ("movies" or "series")
	// 2nd param : the size of data requested ("sample" for 100, "live" for 5000)

	if (!fs.existsSync('src/database/imdb_movies_sample.json'))
		await Scraper.scrape('movies', 'sample')

	if (!fs.existsSync('src/database/imdb_series_sample.json'))
		await Scraper.scrape('series', 'sample')

	// Scraping live data :
	// °°°°°°°°°°°°°°°°°°°°
	/*if (!fs.existsSync('src/database/imdb_movies_live.json'))
     await Scraper.scrape('movies', 'live')

  if (!fs.existsSync('src/database/imdb_series_live.json'))
     await Scraper.scrape('series', 'live')
    */
	} catch (e) {
		console.log(`${'\n'}❌Error while scrapping : ${e}`)
		return e
	}
})()
