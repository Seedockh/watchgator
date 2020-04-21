import './prelude'
import './postlude'
import ExpressServer from './core/ExpressServer'
import Scraper from './core/Scraper'

(async () => {
  await ExpressServer.run()

  try {
    await Scraper.scrapeSample('movies')
    await Scraper.scrapeSample('series')
  } catch(e) {
    console.log('Error while scrapping')
    console.log(e)
  }
})()
