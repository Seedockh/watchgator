import puppeteer from 'puppeteer'
import fs from 'fs'
import ora from 'ora'

class Scraper {
  private sampleMoviesPerPage = 5
  private totalMovies = null
  private nbMoviesWritten = 0
  private browser
  private page
  private spinner = ora('').start()

  private async initScraper() {
    this.browser = await puppeteer.launch()
    this.page = await this.browser.newPage()
    console.log('IMDB scraper started')
  }

  /** * SCRAPE SAMPLE DATASET WITH FEW MOVIES * **/
	public async scrapeSample(): void {
    await this.initScraper()
    await this.insertDatabaseHeaders()
    this.spinner.text = `Building your dataset ...`
    this.spinner.indent++
    let nextPage = null
    let pagination = true

    while (pagination) {
      const currentPageData = await this.scrapePageMovies(nextPage)
      await this.insertPageIntoDatabase(currentPageData)
      const findNextPage = await this.scrapeNextPage()
      this.spinner.text = `√ Progress done : ${findNextPage.totalText}`

      if (this.totalMovies === null) {
        const totalSearchMovies = findNextPage.totalText.replace(/^.* of /, '').replace(' titles.', '')
        const nbPages = Math.ceil(parseInt(totalSearchMovies) / 50)
        this.totalMovies = nbPages * this.sampleMoviesPerPage
      }

      if (findNextPage.nextLink === null) pagination = false
      else nextPage = findNextPage.nextLink
      console.log('')
    }

    this.spinner.indent--
    console.log(`
  ${this.nbMoviesWritten} / ${this.totalMovies} movies written.`)
    this.spinner.succeed('Sample Scraping complete.')

    await this.insertDatabaseFooters()
    await this.browser.close()
  }

  /** * SCRAPING ONE PAGE MOVIES * **/
  private async scrapePageMovies(nextPage = null) {
    const firstSearchUrl = 'https://www.imdb.com/search/title/?title=the+godfather'

    await this.page.goto(nextPage ?? firstSearchUrl, { waitUntil: 'networkidle2' })
    await this.page.setViewport({ width: 1200, height: 800 })
    await this.autoScroll(this.page)

    const data = await this.page.evaluate(sampleMoviesPerPage => {
      let movies = []
      const nodesList = Array.from(document.querySelectorAll('.lister-item'), (item, index) => {
        if (index < sampleMoviesPerPage) {
          let casting = []
          Array.from(item.querySelectorAll('div.ratings-bar + p.text-muted + p > .ghost ~ a'), actor => casting.push(actor.innerText))

          const title = item.querySelector('h3 .lister-item-index + a')
          const year = item.querySelector('h3 span.lister-item-year')
          const rating = item.querySelector('div.ratings-bar > .ratings-imdb-rating strong')
          const nbRatings = item.querySelector('p.sort-num_votes-visible > span.text-muted + span[name="nv"]')
          const metaScore = item.querySelector('div.ratings-bar > .ratings-metascore .metascore')
          const certificate = item.querySelector('p.text-muted > span.certificate')
          const runtime = item.querySelector('p.text-muted > span.runtime')
          const genre = item.querySelector('p.text-muted > span.genre')
          const description = item.querySelector('div.ratings-bar + p.text-muted')
          const picture = item.querySelector('.lister-item-image a img[class="loadlate"]')
          const director = item.querySelector('div.ratings-bar + p.text-muted + p > a')
          const gross = item.querySelector('p.sort-num_votes-visible span.ghost + span.text-muted + span[name="nv"]')

          return movies.push({
            title: title ? title.innerText : null,
            year: year ? year.innerText.replace(/\(|\)/g,'') : null,
            rating: rating ? rating.innerText : null,
            nbRatings: nbRatings ? nbRatings.innerText : null,
            metaScore: metaScore ? metaScore.innerText : null,
            certificate: certificate ? certificate.innerText : null,
            runtime: runtime ? runtime.innerText : null,
            genre: genre ? genre.innerText : null,
            description: description ? description.innerText : null,
            picture: picture ? picture.src.replace(/\@\..*\./g, '@.') : null,
            director: director ? director.innerText : null,
            casting: casting,
            gross: gross ? gross.innerText : null,
          })
        }
      })
      return { movies }
    }, this.sampleMoviesPerPage)
    return JSON.stringify(data)
  }

  /** * GETTING THE NEXT PAGE BUTTON * **/
  private async scrapeNextPage() {
    return await this.page.evaluate(() =>{
      const totalText = document.querySelector("#main > div.article > div.desc > span:nth-child(1)").innerText
      let nextLink = document.querySelector('#main > div > div.desc > a.lister-page-next')
      nextLink = nextLink ? nextLink.href : null
      return { nextLink, totalText }
    })
  }

  /** * SCROLLING ALL PAGE TO PREVENT LAZYLOAD PLACEHOLDERS * **/
  private async autoScroll(page) {
    // Using querystrings to prevent Babel from interpreting async/await
    await page.evaluate(`(async () => {
      await new Promise((resolve, reject) => {
        let totalHeight = 0
        let distance = 100
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight
          window.scrollBy(0, distance)
          totalHeight += distance

          if(totalHeight >= scrollHeight){
            clearInterval(timer)
            resolve()
          }
        }, 100)
      })
    })()`)
  }

  /** * WRITE DATABASE HEADERS * **/
  private async insertDatabaseHeaders(level = 'sample') {
    await fs.writeFile(`src/database/imdb${level === 'sample' ? '_sample' : ''}.json`, '{\n"movies": \n[', 'utf8', err => {
      if (err) return this.spinner.info('Error while writing database headers')
    })
  }

  /** * WRITE CURRENT SCRAPED PAGE INTO DATABASE * **/
  private async insertPageIntoDatabase(data, level = 'sample') {
    let parsedData = JSON.parse(data)
    let dataString = ""
    parsedData.movies.map((movie, index) => dataString += JSON.stringify(movie, null, 4) + ",\n")

    await fs.appendFile(`src/database/imdb${level === 'sample' ? '_sample' : ''}.json`, dataString, 'utf8', err => {
      if (err) {
        this.spinner.fail('Error while writing to database')
        return console.log(err)
      }
      this.nbMoviesWritten += parsedData.movies.length
    })
  }

  /** * WRITE DATABASE FOOTERS * **/
  private async insertDatabaseFooters(level = 'sample') {
    await fs.appendFile(`src/database/imdb${level === 'sample' ? '_sample' : ''}.json`, "]}", 'utf8', err => {
      if (err) return this.spinner.info('Error while writing database footers')
    })
  }
}

export default new Scraper
