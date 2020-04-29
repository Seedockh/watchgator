/** ****** NODE ****** **/
import fs from 'fs'
import _ from 'lodash'

class CreateIMDBDatasetService {
	static envSrc = process.env.NODE_ENV === 'production' ? '.dist/' : 'src/'
	static itemsWritten = 0
	static listenGenres = false
	static genresMap: (string | null)[] = []

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
	static async insertDatabaseHeaders(
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
	static async insertPageIntoDatabase(
		data: string,
		itemsPerPage: number,
		pagesToScrape: number,
		type = 'movies',
		level = 'sample',
	): Promise<number> {
		const parsedData = JSON.parse(data)
		let dataString = ''

		await parsedData.medias.map(async (media: IMDBMedia | null) => {
			this.itemsWritten++
			if (type === 'movies') this.addGenres(media)

			const totalScrapeLevel = itemsPerPage * pagesToScrape
			let singleMedia = JSON.stringify(media, null, 4)

			if (this.itemsWritten < totalScrapeLevel) singleMedia += ',\n'
			else {
				singleMedia += '\n'
				this.itemsWritten = 0
				await this.writeGenresDatabase(level)
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
		return this.itemsWritten
	}

	/** * WRITE DATABASE FOOTERS * **/
	static async insertDatabaseFooters(
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
	static async writeGenresDatabase(level: string): Promise<void> {
		if (!fs.existsSync(`${this.envSrc}database/imdb`))
			fs.mkdirSync(`${this.envSrc}database/imdb`)

		const genres = JSON.stringify({ data: this.genresMap }, null, 4)

		fs.openSync(`${this.envSrc}database/imdb/imdb_genres_${level}.json`, 'w')
		await fs.writeFile(
			`${this.envSrc}database/imdb/imdb_genres_${level}.json`,
			genres,
			'utf8',
			err => {
				if (err) throw err
			},
		)
	}
}

export default CreateIMDBDatasetService
