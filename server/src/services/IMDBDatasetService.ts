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
		const spinner = aLog('Initializing Movies datas ...')
		this.sampleMovies = this.readSampleMovies()
		this.liveMovies = await this.readLiveMovies()
		spinner.succeed('Movies initialized')
	}

	static readSampleMovies(): Dataset {
		const moviesFile: Buffer = fs.readFileSync(
			'src/database/imdb/imdb_movies_sample.json',
		)
		// @ts-ignore: JSON.parse() unreachable Buffer param
		return JSON.parse(moviesFile)
	}

	static readLiveMovies(): Promise<Dataset> {
		return fetch(
			'https://mahara-bucket.s3.eu-west-3.amazonaws.com/watchgator/imdb_movies_live.json',
			{ method: 'GET' },
		)
			.then(response => response.json())
			// @ts-ignore: JSON.parse() unreachable Buffer param
			.then(movies => JSON.parse(JSON.stringify(movies)))
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
