/** ****** NODE ****** **/
import fs from 'fs'
import _ from 'lodash'
import fetch from 'node-fetch'
/** ****** INTERNALS ****** **/
import { aLog } from '../core/Log'

class IMDBDatasetService {
	static envSrc = process.env.NODE_ENV === 'production' ? '.dist/' : 'src/'
	static itemsWritten = 0
	static listenGenres = false
	static genresMap: (string | null)[] = []
	static sampleMovies: Dataset
	static liveMovies: Dataset

	static async init(): Promise<void> {
		const moviesSpinner = aLog('Initializing Movies datas ...')
		this.sampleMovies = this.readSample('movies')
		this.liveMovies = await this.readLive('movies')
		moviesSpinner.succeed('Movies initialized')

		const seriesSpinner = aLog('Initializing Series datas ...')
		this.sampleSeries = this.readSample('series')
		this.liveSeries = await this.readLive('series')
		seriesSpinner.succeed('Series initialized')

		const peoplesSpinner = aLog('Initializing Peoples datas ...')
		this.samplePeoples = this.readSample('peoples')
		this.livePeoples = await this.readLive('peoples')
		peoplesSpinner.succeed('Peoples initialized')

		const genresSpinner = aLog('Initializing Genres datas ...')
		this.sampleGenres = this.readSample('genres')
		this.liveGenres = await this.readLive('genres')
		genresSpinner.succeed('Genres initialized')
	}

	static readSample(type: string): Dataset {
		const sampleFile: Buffer = fs.readFileSync(
			`src/database/imdb/imdb_${type}_sample.json`,
		)
		// @ts-ignore: JSON.parse() unreachable Buffer param
		return JSON.parse(sampleFile)
	}

	static readLive(type: string): Promise<Dataset> {
		return (
			fetch(
				`https://mahara-bucket.s3.eu-west-3.amazonaws.com/watchgator/imdb_${type}_live.json`,
				{ method: 'GET' },
			)
				.then(response => response.json())
				// @ts-ignore: JSON.parse() unreachable Buffer param
				.then(liveFile => JSON.parse(JSON.stringify(liveFile)))
		)
	}

	static enableGenreListenner(): boolean {
		return (this.listenGenres = true)
	}

	static moviesExist(level: string): boolean {
		return fs.existsSync(
			`${this.envSrc}database/imdb/imdb_movies_${level}.json`,
		)
	}

	static seriesExist(level: string): boolean {
		return fs.existsSync(
			`${this.envSrc}database/imdb/imdb_series_${level}.json`,
		)
	}

	static peoplesExist(level: string): boolean {
		return fs.existsSync(
			`${this.envSrc}database/imdb/imdb_peoples_${level}.json`,
		)
	}

	static genresExist(level: string): boolean {
		return fs.existsSync(
			`${this.envSrc}database/imdb/imdb_genres_${level}.json`,
		)
	}

	/** * WRITE DATABASE HEADERS * **/
	static async insertDatasetHeaders(
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
				if (err) throw err
			},
		)
	}

	/** * WRITE CURRENT SCRAPED PAGE INTO DATABASE * **/
	static async insertPageIntoDataset(
		data: string,
		itemsPerPage: number,
		pagesToScrape: number,
		type = 'movies',
		level = 'sample',
	): Promise<number> {
		const parsedData = JSON.parse(data)
		let dataString = ''
		let backupItemsWritten = 0

		parsedData.medias.map((media: IMDBMedia | null) => {
			this.itemsWritten++
			if (type !== 'peoples') this.addGenres(media)

			const totalScrapeLevel = itemsPerPage * pagesToScrape
			let singleMedia = JSON.stringify(media, null, 4)

			if (this.itemsWritten < totalScrapeLevel) singleMedia += ',\n'
			else {
				singleMedia += '\n'
				backupItemsWritten = this.itemsWritten
				this.itemsWritten = 0
				this.writeGenresDataset(level)
			}

			dataString += singleMedia
		})

		await fs.appendFile(
			`${this.envSrc}database/imdb/imdb_${type}_${level}.json`,
			dataString,
			'utf8',
			err => {
				if (err) throw err
			},
		)
		return backupItemsWritten
	}

	/** * WRITE DATABASE FOOTERS * **/
	static async insertDatasetFooters(
		type = 'movies',
		level = 'sample',
	): Promise<void> {
		try {
			await fs.appendFile(
				`${this.envSrc}database/imdb/imdb_${type}_${level}.json`,
				']}',
				'utf8',
				err => {
					if (err) throw err
				},
			)
		} catch (error) {
			throw error
		}
	}

	static addGenres(media: IMDBMedia | null): void {
		if (media && media.genres) {
			media.genres.map(genre => {
				if (genre) {
					if (
						genre.name &&
						_.indexOf(this.genresMap, genre.name.trim()) === -1
					) {
						this.genresMap.push(genre.name.trim())
					}
				}
			})
		}
	}

	/** * WRITE GENRES DATA * **/
	static writeGenresDataset(level: string): void {
		if (!fs.existsSync(`${this.envSrc}database/imdb`))
			fs.mkdirSync(`${this.envSrc}database/imdb`)

		const genres = JSON.stringify({ data: this.genresMap }, null, 4)

		fs.openSync(`${this.envSrc}database/imdb/imdb_genres_${level}.json`, 'w')
		fs.writeFile(
			`${this.envSrc}database/imdb/imdb_genres_${level}.json`,
			genres,
			'utf8',
			err => {
				if (err) throw err
			},
		)
	}
}

export default IMDBDatasetService
