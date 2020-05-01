/** ****** SERVER ****** **/
import { Request, Response, RequestHandler } from 'express'
/** ****** NODE ****** **/
import _ from 'lodash'
/** ****** INTERNALS ****** **/
import IMDBDatasetService from '../../services/IMDBDatasetService'

class SeriesController {
	static getAll(req: Request, res: Response) {
		res.json(
			process.env.NODE_ENV === 'production'
				? _.chunk(IMDBDatasetService.liveSeries.data, 20)
				: _.chunk(IMDBDatasetService.sampleSeries.data, 20),
		)
	}

	static getAllByPage(req: Request, res: Response) {
		const page = parseInt(req.params.page)
		const start = 20 * page
		const end = start + 20

		res.json(
			process.env.NODE_ENV === 'production'
				? _.slice(IMDBDatasetService.liveSeries.data, start, end)
				: _.slice(IMDBDatasetService.sampleSeries.data, start, end),
		)
	}

	static getById(req: Request, res: Response) {
		res.json(
			process.env.NODE_ENV === 'production'
				? _.find(IMDBDatasetService.liveSeries.data, { id: req.params.id })
				: _.find(IMDBDatasetService.sampleSeries.data, { id: req.params.id }),
		)
	}

	static findByKeys(req: Request, res: Response) {
		const keys = { ...req.body }
		const matchCase = keys.matchCase ? '' : 'i'

		const filters: any = {}
		// @ts-ignore: unreachable filters keys
		Object.entries(keys).forEach(
			// @ts-ignore: unreachable keys
			key => (filters[key[0]] = new RegExp(key[1], matchCase)),
		)

		const results = _.filter(
			process.env.NODE_ENV === 'production'
				? IMDBDatasetService.liveSeries.data
				: IMDBDatasetService.sampleSeries.data,
			movie => {
				for (const key in filters) {
					// @ts-ignore: unreachable filters keys
					if (filters[key].test(movie[key])) return true
				}
			},
		)

		if (keys.title) _.sortBy(results, ['title', 'rating'])
		else if (keys.description) _.sortBy(results, ['description', 'rating'])
		else if (keys.rating) _.sortBy(results, ['rating', 'title'])
		else if (keys.metaScore) _.sortBy(results, ['metaScore', 'rating'])
		else if (keys.year) _.sortBy(results, ['year', 'rating'])
		else if (keys.runtime) _.sortBy(results, ['runtime', 'rating'])
		else if (keys.gross) _.sortBy(results, ['gross', 'rating'])
		else if (keys.nbRatings) _.sortBy(results, ['nbRatings', 'rating'])
		else if (keys.certificate) _.sortBy(results, ['certificate', 'rating'])

		res.json({ results: _.chunk(results, 20) })
	}
}

export default SeriesController
