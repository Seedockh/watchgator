/** ****** SERVER ****** **/
import { Request, Response, RequestHandler } from 'express'
/** ****** NODE ****** **/
import _ from 'lodash'
/** ****** INTERNALS ****** **/
import IMDBDatasetService from '../../services/IMDBDatasetService'

const level: string = process.env.NODE_ENV === 'production' ? 'live' : 'sample'

class PeoplesController {
	static getAll(req: Request, res: Response) {
		// @ts-ignore: unreachable key
		const total = IMDBDatasetService[`${level}Peoples`].data.length
		// @ts-ignore: unreachable key
		const results = _.chunk(IMDBDatasetService[`${level}Peoples`].data, 20)

		res.json({ total: total, pages: results.length, results: results })
	}

	static getAllByPage(req: Request, res: Response) {
		const page = parseInt(req.params.page)
		const start = 20 * page
		const end = start + 20
		const result = _.slice(
			// @ts-ignore: unreachable key
			IMDBDatasetService[`${level}Peoples`].data,
			start,
			end,
		)

		res.json({ total: result.length, page: page + 1, results: result })
	}

	static getById(req: Request, res: Response) {
		res.json(
			// @ts-ignore: unreachable key
			_.find(IMDBDatasetService[`${level}Peoples`].data, { id: req.params.id }),
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

		let results = _.filter(
			// @ts-ignore: unreachable key
			IMDBDatasetService[`${level}Peoples`].data,
			people => {
				for (const key in filters) {
					if (keys.fullname) {
						const names = keys.fullname.split(' ')
						const firstRgxp = new RegExp(names[0], matchCase)
						const lastRgxp = new RegExp(names[1], matchCase)

						if (names.length === 1 && firstRgxp.test(`${people.firstname} ${people.lastname}`))
							return true

						if (names.length >= 2 && (
								(firstRgxp.test(`${people.firstname}`) && lastRgxp.test(`${people.lastname}`))
								|| (lastRgxp.test(`${people.firstname}`) && firstRgxp.test(`${people.lastname}`))
							))
								return true
					} else {
						// @ts-ignore: unreachable filters keys
						if (filters[key].test(people[key])) return true
					}
				}
			},
		)

		if (keys.fullname) results = _.orderBy(results, ['lastname', 'firstname'], ['asc', 'asc'])
		else if (keys.firstname) results = _.orderBy(results, ['lastname'], ['asc'])
		else if (keys.lastname) results = _.orderBy(results, ['firstname'], ['asc'])
		else if (keys.role) results = _.orderBy(results, ['role'], ['asc'])

		const total = results.length
		results = _.chunk(results, 20)
		res.json({ total: total, pages: results.length, results: results })
	}
}

export default PeoplesController
