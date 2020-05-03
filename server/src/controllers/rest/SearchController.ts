/** ****** SERVER ****** **/
import { Request, Response, RequestHandler } from 'express'
/** ****** NODE ****** **/
import _ from 'lodash'
/** ****** INTERNALS ****** **/
import IMDBDatasetService from '../../services/IMDBDatasetService'
import { sLog } from '../../core/Log'

class SearchController {
	/** * @TODO: Refactoring for filters * **/
	static search(req: Request, res: Response) {
		const t0: number = new Date().getTime()
		const level: string =
			process.env.NODE_ENV === 'production' ? 'live' : 'sample'
		const { names, filters } = req.body
		let namesParam: IMDBNamesParam
		let filtersParam: IMDBFiltersParam
		let movies: IMDBMedia[]
		let series: IMDBMedia[]

		try {
			if (names) {
				try {
					namesParam = JSON.parse(names)
				} catch {
					throw new Error(
						'Invalid names parameter. It must be JSON.stringify() to be readable by server.',
					)
				}

				if (namesParam.title) {
					movies = _.filter(
						// @ts-ignore: unreachable key
						IMDBDatasetService[`${level}Movies`].data,
						movie => new RegExp(namesParam.title, 'i').test(movie.title),
					)
					series = _.filter(
						// @ts-ignore: unreachable key
						IMDBDatasetService[`${level}Series`].data,
						serie => new RegExp(namesParam.title, 'i').test(serie.title),
					)
				}

				if (namesParam.actors) {
					namesParam.actors.forEach((actor: IMDBPerson) => {
						movies = _.filter(
							// @ts-ignore: unreachable key
							movies ? movies : IMDBDatasetService[`${level}Movies`].data,
							movie => _.some(movie.actors, { id: actor.id }),
						)
						series = _.filter(
							// @ts-ignore: unreachable key
							series ? series : IMDBDatasetService[`${level}Series`].data,
							serie => _.some(serie.directors, { id: actor.id }),
						)
					})
				}

				if (namesParam.directors) {
					namesParam.directors.forEach((director: IMDBPerson) => {
						movies = _.filter(
							// @ts-ignore: unreachable key
							movies ? movies : IMDBDatasetService[`${level}Movies`].data,
							movie => _.some(movie.directors, { id: director.id }),
						)
					})
				}

				if (namesParam.genres) {
					namesParam.genres.forEach((genre: IMDBCategory) => {
						movies = _.filter(
							// @ts-ignore: unreachable key
							movies ? movies : IMDBDatasetService[`${level}Movies`].data,
							movie => _.some(movie.genres, { name: genre.name }),
						)
						series = _.filter(
							// @ts-ignore: unreachable key
							series ? series : IMDBDatasetService[`${level}Series`].data,
							serie => _.some(serie.genres, { name: genre.name }),
						)
					})
				}
			}

			if (filters) {
				try {
					filtersParam = JSON.parse(filters)
				} catch {
					throw new Error(
						'Invalid filters parameter. It must be JSON.stringify() to be readable by server.',
					)
				}

				if (filtersParam.year) {
					movies = _.filter(
						// @ts-ignore: unreachable key
						movies ? movies : IMDBDatasetService[`${level}Movies`].data,
						movie =>
							movie.year >= filtersParam.year.min &&
							movie.year <= filtersParam.year.max,
					)
					series = _.filter(
						// @ts-ignore: unreachable key
						series ? series : IMDBDatasetService[`${level}Series`].data,
						serie =>
							serie.year >= filtersParam.year.min! &&
							serie.year <= filtersParam.year.max,
					)
				}

				if (filtersParam.rating) {
					movies = _.filter(
						// @ts-ignore: unreachable key
						movies ? movies : IMDBDatasetService[`${level}Movies`].data,
						movie =>
							movie.rating >= filtersParam.rating.min &&
							movie.rating <= filtersParam.rating.max,
					)
					series = _.filter(
						// @ts-ignore: unreachable key
						series ? series : IMDBDatasetService[`${level}Series`].data,
						serie =>
							serie.rating >= filtersParam.rating.min &&
							serie.rating <= filtersParam.rating.max,
					)
				}

				if (filtersParam.metaScore) {
					movies = _.filter(
						// @ts-ignore: unreachable key
						movies ? movies : IMDBDatasetService[`${level}Movies`].data,
						movie =>
							movie.metaScore >= filtersParam.metaScore.min &&
							movie.metaScore <= filtersParam.metaScore.max,
					)
					series = _.filter(
						// @ts-ignore: unreachable key
						series ? series : IMDBDatasetService[`${level}Series`].data,
						serie =>
							serie.metaScore >= filtersParam.metaScore.min &&
							serie.metaScore <= filtersParam.metaScore.max,
					)
				}

				if (filtersParam.nbRatings) {
					// nbRatings: {min: 0, max: 1000000},
					/** @TODO */
				}

				if (filtersParam.certificate) {
					// certificate: ["Tous Publics", "Tous Publics (avec avertissement)", "0+", "6+", "9+", "10", "12", "14+", "16", "18", "X"],
					/** @TODO */
				}

				if (filtersParam.runtime) {
					movies = _.filter(
						// @ts-ignore: unreachable key
						movies ? movies : IMDBDatasetService[`${level}Movies`].data,
						movie =>
							movie.runtime >= filtersParam.runtime.min &&
							movie.runtime <= filtersParam.runtime.max,
					)
					series = _.filter(
						// @ts-ignore: unreachable key
						series ? series : IMDBDatasetService[`${level}Series`].data,
						serie =>
							serie.runtime >= filtersParam.runtime.min &&
							serie.runtime <= filtersParam.metaScore.max,
					)
				}

				if (filtersParam.gross) {
					// gross: { min: 0, max: ""$1000M" }
					/** @TODO */
				}
			}

			// @ts-ignore: unreachable key
			const totalMovies = movies ? movies.length : IMDBDatasetService[`${level}Movies`].data.length
			// @ts-ignore: unreachable key
			const totalSeries = series ? series.length : IMDBDatasetService[`${level}Series`].data.length
			// @ts-ignore: unreachable key
			const resultMovies = _.chunk(movies ? movies : IMDBDatasetService[`${level}Movies`].data,	20)
			// @ts-ignore: unreachable key
			const resultSeries = _.chunk(series ? series : IMDBDatasetService[`${level}Series`].data, 20)

			const time: number = new Date().getTime() - t0
			sLog(
				`[${new Date().toLocaleDateString()}-${new Date().toLocaleTimeString()}] Search reached ${totalMovies +
					totalSeries} results in ${time}ms`,
				'FFA500',
			)
			res.json({
				total: totalMovies + totalSeries,
				time: time,
				totalMovies: totalMovies,
				totalSeries: totalSeries,
				moviesPages: resultMovies.length,
				seriesPages: resultSeries.length,
				results: {
					movies: resultMovies,
					series: resultSeries,
				},
			})
		} catch (error) {
			sLog(
				`[${new Date().toLocaleDateString()}-${new Date().toLocaleTimeString()}] Search error: ${error}`,
				'FF0000',
			)
			res.json({ error: true, message: `${error}` })
		}
	}
}

export default SearchController
