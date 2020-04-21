import fs from 'fs'
import './prelude'
import './postlude'
import ExpressServer from './core/ExpressServer'
import Scraper from './core/Scraper'

;(async (): void => {
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

	} catch (e) {
		console.log('Error while scrapping')
		console.log(e)
	}
})()
