import './prelude'
import './postlude'
import ExpressServer from './core/ExpressServer'
import Scraper from './core/Scraper'

(async () => {
  await ExpressServer.run()

  try {
    // 1st param : the type of the data to scrape ("movies" or "series")
    // 2nd param : the size of data requested ("sample" for 100, "live" for 5000)
    await Scraper.scrape('movies', 'sample')
    await Scraper.scrape('series', 'sample')
  } catch(e) {
    console.log('Error while scrapping')
    console.log(e)
  }
})()
