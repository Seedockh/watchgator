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
		const { names, filters, pageMovies, pageSeries, type } = req.body as SearchPayload
		let namesParam: SearchNamesPayload = names
		let filtersParam: SearchFiltersPayload = filters
		let movies: IMDBMedia[]
		let series: IMDBMedia[]
		const pagination = 50
		const pageMoviesSelected = pageMovies ? pageMovies - 1 : 0
		const pageSeriesSelected = pageSeries ? pageSeries - 1 : 0
		const typeSelected = type === 'movies' ? 0 : (type === 'series' ? 2 : 1)

		try {
			if (names) {
				if (namesParam.title) {
					if (typeSelected <= 1) {
						movies = _.filter(
							// @ts-ignore: unreachable key
							IMDBDatasetService[`${level}Movies`].data,
							movie => new RegExp(namesParam.title, 'i').test(movie.title),
						)
					}
					if (typeSelected >= 1) {
						series = _.filter(
							// @ts-ignore: unreachable key
							IMDBDatasetService[`${level}Series`].data,
							serie => new RegExp(namesParam.title, 'i').test(serie.title),
						)
					}
				}

				if (namesParam.actors) {
					namesParam.actors.forEach((actor: IMDBPerson) => {
						if (typeSelected <= 1) {
							movies = _.filter(
								// @ts-ignore: unreachable key
								movies ? movies : IMDBDatasetService[`${level}Movies`].data,
								movie => _.some(movie.actors, { id: actor.id }),
							)
						}
						if (typeSelected >= 1) {
							series = _.filter(
								// @ts-ignore: unreachable key
								series ? series : IMDBDatasetService[`${level}Series`].data,
								serie => _.some(serie.directors, { id: actor.id }),
							)
						}
					})
				}

				if (namesParam.directors) {
					namesParam.directors.forEach((director: IMDBPerson) => {
						if (typeSelected <= 1) {
							movies = _.filter(
								// @ts-ignore: unreachable key
								movies ? movies : IMDBDatasetService[`${level}Movies`].data,
								movie => _.some(movie.directors, { id: director.id }),
							)
						}
					})
				}

				if (namesParam.genres) {
					namesParam.genres.forEach((genre: IMDBCategory) => {
						if (typeSelected <= 1) {
							movies = _.filter(
								// @ts-ignore: unreachable key
								movies ? movies : IMDBDatasetService[`${level}Movies`].data,
								movie => _.some(movie.genres, { name: genre.name }),
							)
						}
						if (typeSelected >= 1) {
							series = _.filter(
								// @ts-ignore: unreachable key
								series ? series : IMDBDatasetService[`${level}Series`].data,
								serie => _.some(serie.genres, { name: genre.name }),
							)
						}
					})
				}
			}

			if (filters) {
				if (filtersParam.year) {
					if (typeSelected <= 1) {
						movies = _.filter(
							// @ts-ignore: unreachable key
							movies ? movies : IMDBDatasetService[`${level}Movies`].data,
							movie =>
								movie.year >= filtersParam.year.min &&
								movie.year <= filtersParam.year.max,
						)
					}
					if (typeSelected >= 1) {
						series = _.filter(
							// @ts-ignore: unreachable key
							series ? series : IMDBDatasetService[`${level}Series`].data,
							serie =>
								serie.year >= filtersParam.year.min! &&
								serie.year <= filtersParam.year.max,
						)
					}
				}

				if (filtersParam.rating) {
					if (typeSelected <= 1) {
						movies = _.filter(
							// @ts-ignore: unreachable key
							movies ? movies : IMDBDatasetService[`${level}Movies`].data,
							movie =>
								movie.rating >= filtersParam.rating.min &&
								movie.rating <= filtersParam.rating.max,
						)
					}
					if (typeSelected >= 1) {
						series = _.filter(
							// @ts-ignore: unreachable key
							series ? series : IMDBDatasetService[`${level}Series`].data,
							serie =>
								serie.rating >= filtersParam.rating.min &&
								serie.rating <= filtersParam.rating.max,
						)
					}
				}

				if (filtersParam.metaScore) {
					if (typeSelected <= 1) {
						movies = _.filter(
							// @ts-ignore: unreachable key
							movies ? movies : IMDBDatasetService[`${level}Movies`].data,
							movie =>
								movie.metaScore >= filtersParam.metaScore.min &&
								movie.metaScore <= filtersParam.metaScore.max,
						)
					}
					if (typeSelected >= 1) {
						series = _.filter(
							// @ts-ignore: unreachable key
							series ? series : IMDBDatasetService[`${level}Series`].data,
							serie =>
								serie.metaScore >= filtersParam.metaScore.min &&
								serie.metaScore <= filtersParam.metaScore.max,
						)
					}
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
					if (typeSelected <= 1) {
						movies = _.filter(
							// @ts-ignore: unreachable key
							movies ? movies : IMDBDatasetService[`${level}Movies`].data,
							movie =>
								movie.runtime >= filtersParam.runtime.min &&
								movie.runtime <= filtersParam.runtime.max,
						)
					}
					if (typeSelected >= 1) {
						series = _.filter(
							// @ts-ignore: unreachable key
							series ? series : IMDBDatasetService[`${level}Series`].data,
							serie =>
								serie.runtime >= filtersParam.runtime.min &&
								serie.runtime <= filtersParam.metaScore.max,
						)
					}
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

			const resultMovies = _.chunk(movies ?
				// @ts-ignore: unreachable key
				movies : IMDBDatasetService[`${level}Movies`].data,
				pagination
			)

			const resultSeries = _.chunk(series ?
				// @ts-ignore: unreachable key
				series : IMDBDatasetService[`${level}Series`].data,
				pagination
			)

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
					movies: resultMovies.length > 0 ? resultMovies[pageMoviesSelected] : [],
					series: resultSeries.length > 0 ? resultSeries[pageSeriesSelected] : [],
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
