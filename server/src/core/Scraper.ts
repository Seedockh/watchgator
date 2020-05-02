/** ****** SCRAPING ****** **/
import puppeteer, { Browser, Page } from 'puppeteer'
/** ****** INTERNALS ****** **/
import IMDBDatasetService from '../services/IMDBDatasetService'
import { sLog, aLog } from './Log'

class Scraper {
	private moviesEndpoint =
		'https://www.imdb.com/search/title/?title_type=feature,tv_movie'
	private seriesEndpoint =
		'https://www.imdb.com/search/title/?title_type=tv_series'
	private peoplesEndpoint =
		'https://www.imdb.com/search/name/?gender=male,female'
	private sampleItemsPerPage = 50
	private samplePagesToScrape = 2
	private liveItemsPerPage = 50
	private livePagesToScrape = 100
	private totalItems: number | null = null
	private totalPages!: number | null
	private nbItemsWritten = 0
	private browser!: Browser
	private page!: Page
	// @ts-ignore: Can't let property uninitialized
	private spinner: Ora

	/** * BOOT SCRAPING ON START * **/
	public async boot(level: string = 'sample'): Promise<void | string> {
		try {
			if (!IMDBDatasetService.genresExist(level)) {
				sLog('Genres datas not found on your system')
				aLog('').succeed('Enabled Genres generator')
				IMDBDatasetService.enableGenreListenner()
			}

			if (!IMDBDatasetService.moviesExist(level)) {
				sLog('Movies datas not found on your system')
				await this.scrape('movies', level)
			}

			if (!IMDBDatasetService.seriesExist(level)) {
				sLog('Series datas not found on your system')
				await this.scrape('series', level)
			}

			if (!IMDBDatasetService.peoplesExist(level)) {
				sLog('Peoples datas not found on your system')
				await this.scrape('peoples', level)
			}
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
		await IMDBDatasetService.insertDatasetHeaders(type, level)
		this.spinner.text = `Scraping ${type} sample dataset ...`
		let nextPage: string | null = null
		let currentPage = 0
		let pagination = true

		// @ts-ignore: Unreachable context key
		while (pagination && currentPage < this[level + 'PagesToScrape']) {
			currentPage++
			const currentPageData =
				type === 'peoples'
					? await this.scrapePagePeople(type, nextPage)
					: await this.scrapePageMedias(type, nextPage)

			this.nbItemsWritten = await IMDBDatasetService.insertPageIntoDataset(
				currentPageData,
				level === 'live' ? this.liveItemsPerPage : this.sampleItemsPerPage,
				level === 'live' ? this.livePagesToScrape : this.samplePagesToScrape,
				type,
				level,
			)

			const findNextPage = await this.scrapeNextPage()

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

		await IMDBDatasetService.insertDatasetFooters(type, level)
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
						const actors: Array<IMDBPerson | null> = []
						const directors: Array<IMDBPerson | null> = []
						const genres: Array<IMDBCategory | null> = []

						const actorsList: ArrayLike<MediaElement> = item.querySelectorAll(
							'div.ratings-bar + p.text-muted + p > .ghost ~ a',
						)
						Array.from(actorsList, (actor: MediaElement) =>
							actorsList
								? actors.push({
										id: actor.getAttribute('href')!.split('/')[2],
										name: actor.innerText,
								  })
								: null,
						)

						let isDirector = true
						const directorsList: ArrayLike<MediaElement> = item.querySelectorAll(
							'div.ratings-bar + p.text-muted + p > *',
						)
						Array.from(directorsList, (director: MediaElement) => {
							if (director.localName === 'span') isDirector = false

							if (isDirector && directorsList) {
								directors.push({
									id: director.getAttribute('href')!.split('/')[2],
									name: director.innerText,
								})
							}
						})

						const genresList: MediaElement | null = item.querySelector(
							'p.text-muted > span.genre',
						)
						const genresArray: Array<string | null> = genresList
							? genresList.innerText.split(', ')
							: []
						genresArray.map((genre: string | null) =>
							genres.push({ name: genre ?? null }),
						)

						const id: MediaElement | null = item.querySelector(
							'.lister-item .lister-top-right .ribbonize',
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
						const description: MediaElement | null = item.querySelector(
							'div.ratings-bar + p.text-muted',
						)
						const picture: MediaElement | null = item.querySelector(
							'.lister-item-image a img[class="loadlate"]',
						)
						const gross: MediaElement | null = item.querySelector(
							'p.sort-num_votes-visible span.ghost + span.text-muted + span[name="nv"]',
						)

						return medias.push({
							id: id ? id.getAttribute('data-tconst') : null,
							title: title ? title.innerText : null,
							year: year
								? parseInt(year.innerText.replace(/\(|\)/g, ''))
								: null,
							rating: rating ? parseFloat(rating.innerText) : null,
							nbRatings: nbRatings
								? parseInt(nbRatings.getAttribute('data-value'))
								: null,
							metaScore: metaScore ? parseInt(metaScore.innerText) : null,
							certificate: certificate ? certificate.innerText : null,
							runtime: runtime
								? parseInt(runtime.innerText.replace(' min', ''))
								: null,
							genres: genres,
							description: description ? description.innerText : null,
							picture: picture ? picture.src.replace(/\@\..*\./g, '@.') : null,
							directors: directors,
							actors: actors,
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

	/** * SCRAPING ONE PAGE PEOPLES * **/
	private async scrapePagePeople(
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
				const medias: IMDBPeople[] = []
				const itemsList: ArrayLike<MediaElement> = document.querySelectorAll(
					'.lister-item',
				)

				Array.from(itemsList, (item: MediaElement, index) => {
					if (index < sampleItemsPerPage) {
						const id: MediaElement | null = item.querySelector(
							'.lister-item .lister-item-image a',
						)
						const name: MediaElement | null = item.querySelector(
							'h3.lister-item-header .lister-item-index + a',
						)
						const picture: MediaElement | null = item.querySelector(
							'.lister-item-image a img',
						)
						const role: MediaElement | null = item.querySelector(
							'h3 + p.text-small',
						)

						return medias.push({
							id: id ? id.href.split('/')[4] : null,
							firstname: name ? name.innerText.trim().split(' ')[0] : null,
							lastname: name ? name.innerText.trim().split(' ')[1] : null,
							picture: picture ? picture.src.replace(/\@\..*\./g, '@.') : null,
							role: role ? role.innerText.split(' | ')[0] : null,
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
}

export default new Scraper()
