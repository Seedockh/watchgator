/** ****** SERVER ****** **/
import { Request, Response, RequestHandler } from 'express'
/** ****** NODE ****** **/
import _ from 'lodash'
/** ****** INTERNALS ****** **/
import IMDBDatasetService from '../../services/IMDBDatasetService'

const level: string = process.env.NODE_ENV === 'production' ? 'live' : 'sample'

class SeriesController {
	static getAll(req: Request, res: Response) {
		const total = IMDBDatasetService[`${level}Series`].data.length
		const results = _.chunk(IMDBDatasetService[`${level}Series`].data, 20)

		res.json({ total: total, pages: results.length, results: results })
	}

	static getAllByPage(req: Request, res: Response) {
		const page = parseInt(req.params.page) - 1
		const start = 20 * page
		const end = start + 20
		const result = _.slice(IMDBDatasetService[`${level}Series`].data, start, end)

		res.json({ total: result.length, page: page+1, results: result })
	}

	static getById(req: Request, res: Response) {
		res.json(_.find(IMDBDatasetService[`${level}Series`].data, { id: req.params.id }))
	}

	static findByKeys(req: Request, res: Response) {
		const keys = { ...req.body }
		const matchCase = keys.matchCase ? '' : 'i'

		const filters: any = {}
		// @ts-ignore: unreachable filters keys
		Object.entries(keys).forEach(
			// @ts-ignore: unreachable keys
			(key: string[]) => (filters[key[0]] = new RegExp(key[1], matchCase)),
		)

		let results = _.filter(
			IMDBDatasetService[`${level}Series`].data,
			serie => {
				for (const key in filters) {
					// @ts-ignore: unreachable filters keys
					if (filters[key].test(serie[key])) return true
				}
			},
		)

		if (keys.title) results = _.orderBy(results, ['rating'], ['desc'])
		else if (keys.description) results = _.orderBy(results, ['rating'], ['desc'])
		else if (keys.rating) results = _.orderBy(results, ['rating'], ['desc'])
		else if (keys.metaScore) results = _.orderBy(results, ['metaScore', 'rating'], ['desc', 'desc'])
		else if (keys.year) results = _.orderBy(results, ['rating'], ['desc'])
		else if (keys.runtime) results = _.orderBy(results, ['rating'], ['desc'])
		// else if (keys.gross) results = _.sortBy(results, ['gross', 'rating'])
		// else if (keys.nbRatings) results = _.sortBy(results, ['nbRatings', 'rating'])
		// else if (keys.certificate) results = _.sortBy(results, ['certificate', 'rating'])

		const total = results.length
		results = _.chunk(results, 20)
		res.json({ total: total, pages: results.length, results: results })
	}
}

export default SeriesController
