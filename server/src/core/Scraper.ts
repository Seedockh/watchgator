/** ****** SCRAPING ****** **/
import puppeteer from 'puppeteer'
/** ****** NODE ****** **/
import fs from 'fs'
/** ****** LOG ****** **/
import { sLog, aLog } from './Log'

class Scraper {
	private moviesEndpoint =
		'https://www.imdb.com/search/title/?title_type=feature,tv_movie'
	private seriesEndpoint =
		'https://www.imdb.com/search/title/?title_type=tv_series'
	private sampleItemsPerPage = 50
	private samplePagesToScrape = 2
	private liveItemsPerPage = 50
	private livePagesToScrape = 100
	private totalItems = null
	private totalPages = null
	private nbItemsWritten = 0
	private browser = null
	private page = null
	private spinner

	/** * BOOT SCRAPING ON START * **/
	public async boot(): void {
	  try {
			// 1st param : the type of the data to scrape ("movies" or "series")
			// 2nd param : the size of data requested ("sample" for 100, "live" for 5000)
			if (!fs.existsSync('src/database/imdb/imdb_movies_sample.json')) {
				sLog('Movies datas not found on your system, scraping ...')
				await this.scrape('movies', 'sample')
			} else sLog('✔ Movies datas found', '#008000')

			if (!fs.existsSync('src/database/imdb/imdb_series_sample.json')) {
				sLog('Series datas not found on your system, scraping ...')
				await this.scrape('series', 'sample')
			} else sLog('✔ Series datas found', '#008000')
		} catch (e) {
			this.spinner.fail(`Error while scrapping : ${e}`)
			return e
		}
	}

	private async setupScraper(): void {
		this.browser = await puppeteer.launch()
		this.page = await this.browser.newPage()
		this.spinner = aLog('')
	}

	/** * SCRAPE SAMPLE DATASET WITH FEW MEDIAS * **/
	public async scrape(type, level): void {
		await this.setupScraper()
		await this.insertDatabaseHeaders(type, level)
		this.spinner.text = `Building ${type} sample dataset ...`
		let nextPage = null
		let currentPage = 0
		let pagination = true

		while (pagination && currentPage < this[level + 'PagesToScrape']) {
			currentPage++
			const currentPageData = await this.scrapePageMedias(type, nextPage)
			await this.insertPageIntoDatabase(currentPageData, type, level)
			const findNextPage = await this.scrapeNextPage()
			this.spinner.text = `Progress done : ${findNextPage.totalText}`

			if (this.totalItems === null) {
				// const totalSearchItems = findNextPage.totalText.replace(/^.* of /, '').replace(' titles.', '')
				// const nbPages = Math.ceil(parseInt(totalSearchItems) / 50)
				this.totalItems =
					this[level + 'ItemsPerPage'] * this[level + 'PagesToScrape']
			}

			if (findNextPage.nextLink === null) pagination = false
			else nextPage = findNextPage.nextLink
		}

		this.spinner.succeed(`${level.toUpperCase()} ${type} Scraping complete.`)

		await this.insertDatabaseFooters(type, level)
		this.totalItems = null
		this.totalPages = null
		this.nbItemsWritten = 0
		await this.browser.close()
	}

	/** * SCRAPING ONE PAGE MEDIAS * **/
	private async scrapePageMedias(type, nextPage = null): string {
		await this.page.goto(nextPage ?? this[type + 'Endpoint'], {
			waitUntil: 'networkidle2',
		})
		await this.page.setViewport({ width: 1200, height: 800 })
		await this.autoScroll(this.page)

		try {
			const data = await this.page.evaluate(sampleItemsPerPage => {
				const medias = []

				Array.from(document.querySelectorAll('.lister-item'), (item, index) => {
					if (index < sampleItemsPerPage) {
						const casting = []
						Array.from(
							item.querySelectorAll(
								'div.ratings-bar + p.text-muted + p > .ghost ~ a',
							),
							actor => casting.push(actor ? actor.innerText : null),
						)

						const title = item.querySelector('h3 .lister-item-index + a')
						const year = item.querySelector('h3 span.lister-item-year')
						const rating = item.querySelector(
							'div.ratings-bar > .ratings-imdb-rating strong',
						)
						const nbRatings = item.querySelector(
							'p.sort-num_votes-visible > span.text-muted + span[name="nv"]',
						)
						const metaScore = item.querySelector(
							'div.ratings-bar > .ratings-metascore .metascore',
						)
						const certificate = item.querySelector(
							'p.text-muted > span.certificate',
						)
						const runtime = item.querySelector('p.text-muted > span.runtime')
						const genre = item.querySelector('p.text-muted > span.genre')
						const description = item.querySelector(
							'div.ratings-bar + p.text-muted',
						)
						const picture = item.querySelector(
							'.lister-item-image a img[class="loadlate"]',
						)
						const director = item.querySelector(
							'div.ratings-bar + p.text-muted + p > a',
						)
						const gross = item.querySelector(
							'p.sort-num_votes-visible span.ghost + span.text-muted + span[name="nv"]',
						)

						return medias.push({
							title: title ? title.innerText : null,
							year: year ? year.innerText.replace(/\(|\)/g, '') : null,
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
				return { medias }
			}, this.sampleItemsPerPage)

			return JSON.stringify(data)
		} catch (e) {
			this.spinner.fail(`Error when attempting to browse ${
				nextPage ?? this[type + 'Endpoint']
			}
${e}`)
			return {}
		}
	}

	/** * GETTING THE NEXT PAGE BUTTON * **/
	private async scrapeNextPage(): Record<string> {
		return await this.page.evaluate(() => {
			const totalText = document.querySelector(
				'#main > div.article > div.desc > span:nth-child(1)',
			).innerText
			let nextLink = document.querySelector(
				'#main > div > div.desc > a.lister-page-next',
			)
			nextLink = nextLink ? nextLink.href : null
			return { nextLink, totalText }
		})
	}

	/** * SCROLLING ALL PAGE TO PREVENT LAZYLOAD PLACEHOLDERS * **/
	private async autoScroll(page): void {
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
	private async insertDatabaseHeaders(type = 'movies', level = 'sample'): void {
		if (!fs.existsSync('src/database/imdb')) fs.mkdirSync('src/database/imdb')

		fs.openSync(`src/database/imdb/imdb_${type}_${level}.json`, 'w')
		fs.writeFile(
			`src/database/imdb/imdb_${type}_${level}.json`,
			'{\n"data": \n[',
			'utf8',
			err => {
				if (err)
					return this.spinner.info('Error while writing database headers')
			},
		)
	}

	/** * WRITE CURRENT SCRAPED PAGE INTO DATABASE * **/
	private async insertPageIntoDatabase(
		data,
		type = 'movies',
		level = 'sample',
	): void {
		const parsedData = JSON.parse(data)
		let dataString = ''
		parsedData.medias.map(
			media => (dataString += JSON.stringify(media, null, 4) + ',\n'),
		)

		await fs.appendFile(
			`src/database/imdb/imdb_${type}_${level}.json`,
			dataString,
			'utf8',
			err => {
				if (err) {
					this.spinner.fail('Error while writing to database')
					return sLog(err, '#b20000')
				}
				this.nbItemsWritten += parsedData.medias.length
			},
		)
	}

	/** * WRITE DATABASE FOOTERS * **/
	private async insertDatabaseFooters(type = 'movies', level = 'sample'): void {
		await fs.appendFile(
			`src/database/imdb/imdb_${type}_${level}.json`,
			']}',
			'utf8',
			err => {
				if (err)
					return this.spinner.fail('Error while writing database footers')
			},
		)
	}
}

export default new Scraper()
