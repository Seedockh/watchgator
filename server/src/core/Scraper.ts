/** ****** SCRAPING ****** **/
import puppeteer, { Browser, Page } from 'puppeteer'
/** ****** FILES ****** **/
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
	private totalItems: number | null = null
	private totalPages!: number | null
	private nbItemsWritten = 0
	private browser!: Browser
	private page!: Page
	private envSrc = process.env.NODE_ENV === 'production' ? '.dist/' : 'src/'
	// @ts-ignore: Can't let property uninitialized
	private spinner: Ora

	/** * BOOT SCRAPING ON START * **/
	public async boot(level: string = 'sample'): Promise<void | string> {
		try {
			// 1st param : the type of the data to scrape ("movies" or "series")
			// 2nd param : the size of data requested ("sample" for 100, "live" for 5000)
			if (
				!fs.existsSync(`${this.envSrc}database/imdb/imdb_movies_${level}.json`)
			) {
				sLog('Movies datas not found on your system')
				await this.scrape('movies', level)
			} else aLog('').succeed('Movies datas found')

			if (
				!fs.existsSync(`${this.envSrc}database/imdb/imdb_series_${level}.json`)
			) {
				sLog('Series datas not found on your system')
				await this.scrape('series', level)
			} else aLog('').succeed('Series datas found')
		} catch (e) {
			sLog(`Error while scrapping : ${e}`, '#FF0000')
			return e
		}
	}

	private async setupScraper(): Promise<void> {
		this.browser = await puppeteer.launch({ args: ['--no-sandbox'] })
		this.page = await this.browser.newPage()
		this.spinner = aLog('')
	}

	/** * SCRAPE SAMPLE DATASET WITH FEW MEDIAS * **/
	public async scrape(type: string, level: string): Promise<void> {
		await this.setupScraper()
		await this.insertDatabaseHeaders(type, level)
		this.spinner.text = `Scraping ${type} sample dataset ...`
		let nextPage: string | null = null
		let currentPage = 0
		let pagination = true

		// @ts-ignore: Unreachable context key
		while (pagination && currentPage < this[level + 'PagesToScrape']) {
			currentPage++
			const currentPageData = await this.scrapePageMedias(type, nextPage)
			await this.insertPageIntoDatabase(currentPageData, type, level)
			const findNextPage = await this.scrapeNextPage()
			//this.spinner.text = `Progress done : ${findNextPage.totalText}`

			if (this.totalItems === null) {
				this.totalItems =
					// @ts-ignore: Unreachable context key
					this[level + 'ItemsPerPage'] * this[level + 'PagesToScrape']
			}

			// @ts-ignore: Unreachable context key
			this.spinner.text = `${currentPage * this[level + 'ItemsPerPage']}/${
				this.totalItems
			} ${type} scraped.`

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
	private async scrapePageMedias(
		type: string,
		nextPage: string | null = null,
	): Promise<string> {
		// @ts-ignore: Unreachable context key
		await this.page.goto(nextPage ?? this[type + 'Endpoint'], {
			waitUntil: 'networkidle2',
		})
		await this.page.setViewport({ width: 1200, height: 800 })
		await this.autoScroll(this.page)

		try {
			const data = await this.page.evaluate(sampleItemsPerPage => {
				const medias: IMDBMedia[] = []
				const itemsList: ArrayLike<MediaElement> = document.querySelectorAll(
					'.lister-item',
				)

				Array.from(itemsList, (item: MediaElement, index) => {
					if (index < sampleItemsPerPage) {
						const casting: Array<string | null> = []
						const actorsList: ArrayLike<MediaElement> = item.querySelectorAll(
							'div.ratings-bar + p.text-muted + p > .ghost ~ a',
						)

						Array.from(actorsList, (actor: MediaElement) =>
							casting.push(actor ? actor.innerText : null),
						)

						const title: MediaElement | null = item.querySelector(
							'h3 .lister-item-index + a',
						)
						const year: MediaElement | null = item.querySelector(
							'h3 span.lister-item-year',
						)
						const rating: MediaElement | null = item.querySelector(
							'div.ratings-bar > .ratings-imdb-rating strong',
						)
						const nbRatings: MediaElement | null = item.querySelector(
							'p.sort-num_votes-visible > span.text-muted + span[name="nv"]',
						)
						const metaScore: MediaElement | null = item.querySelector(
							'div.ratings-bar > .ratings-metascore .metascore',
						)
						const certificate: MediaElement | null = item.querySelector(
							'p.text-muted > span.certificate',
						)
						const runtime: MediaElement | null = item.querySelector(
							'p.text-muted > span.runtime',
						)
						const genre: MediaElement | null = item.querySelector(
							'p.text-muted > span.genre',
						)
						const description: MediaElement | null = item.querySelector(
							'div.ratings-bar + p.text-muted',
						)
						const picture: MediaElement | null = item.querySelector(
							'.lister-item-image a img[class="loadlate"]',
						)
						const director: MediaElement | null = item.querySelector(
							'div.ratings-bar + p.text-muted + p > a',
						)
						const gross: MediaElement | null = item.querySelector(
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
				// @ts-ignore: Unreachable context key
				nextPage ?? this[type + 'Endpoint']
			}
${e}`)
			return e
		}
	}

	/** * GETTING THE NEXT PAGE BUTTON * **/
	private async scrapeNextPage(): Promise<{
		nextLink: string | null
		totalText: string | null
	}> {
		return await this.page.evaluate(() => {
			const totalImdbText: MediaElement | null = document.querySelector(
				'#main > div.article > div.desc > span:nth-child(1)',
			)
			const nextImdbLink: MediaElement | null = document.querySelector(
				'#main > div > div.desc > a.lister-page-next',
			)

			const totalText: string | null = totalImdbText
				? totalImdbText.innerText
				: null
			const nextLink: string | null = nextImdbLink ? nextImdbLink.href : null

			return { nextLink, totalText }
		})
	}

	/** * SCROLLING ALL PAGE TO PREVENT LAZYLOAD PLACEHOLDERS * **/
	private async autoScroll(page: Page): Promise<void> {
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
	private async insertDatabaseHeaders(
		type = 'movies',
		level = 'sample',
	): Promise<void> {
		if (!fs.existsSync(`${this.envSrc}database/imdb`))
			fs.mkdirSync(`${this.envSrc}database/imdb`)

		fs.openSync(`${this.envSrc}database/imdb/imdb_${type}_${level}.json`, 'w')
		fs.writeFile(
			`${this.envSrc}database/imdb/imdb_${type}_${level}.json`,
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
		data: string,
		type = 'movies',
		level = 'sample',
	): Promise<void> {
		const parsedData = JSON.parse(data)
		let dataString = ''
		parsedData.medias.map((media: string | null) => {
			this.nbItemsWritten++
			let totalScrapeLevel: number
			let singleMedia = JSON.stringify(media, null, 4)

			if (level === 'live') {
				totalScrapeLevel = this.liveItemsPerPage * this.livePagesToScrape
				singleMedia += this.nbItemsWritten < totalScrapeLevel ? ',\n' : '\n'
			} else {
				totalScrapeLevel = this.sampleItemsPerPage * this.samplePagesToScrape
				singleMedia += this.nbItemsWritten < totalScrapeLevel ? ',\n' : '\n'
			}

			dataString += singleMedia
		})

		await fs.appendFile(
			`${this.envSrc}database/imdb/imdb_${type}_${level}.json`,
			dataString,
			'utf8',
			err => {
				if (err) {
					this.spinner.fail('Error while writing to database')
					return sLog(`${err}`, '#b20000')
				}
			},
		)
	}

	/** * WRITE DATABASE FOOTERS * **/
	private async insertDatabaseFooters(
		type = 'movies',
		level = 'sample',
	): Promise<void> {
		try {
			await fs.appendFile(
				`${this.envSrc}database/imdb/imdb_${type}_${level}.json`,
				']}',
				'utf8',
				err => {
					if (err)
						return this.spinner.fail('Error while writing database footers')
				},
			)
		} catch (error) {
			this.spinner.fail(error)
		}
	}
}

export default new Scraper()
