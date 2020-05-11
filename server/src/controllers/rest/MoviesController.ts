/** ****** SERVER ****** **/
import { Request, Response, RequestHandler } from 'express'
/** ****** DATABASE ******* **/
import { NativeError, Document } from 'mongoose'
/** ****** INTERNALS ****** **/
import Imdb from '../../database/Imdb'
import { sLog } from '../../core/Log'

class MoviesController {
	static async getAll(req: Request, res: Response) {
		const t0: number = new Date().getTime()
		const page = parseInt(req.params.page) > 0 ? parseInt(req.params.page) : 1
		const total = await Imdb.Movies.countDocuments()
		const totalPages = (total / Imdb.limit)

		await Imdb.Movies
			.find()
			.limit(Imdb.limit)
			.skip(Imdb.limit * (page - 1))
      .exec((err: NativeError, docs: Document[]) => {
        if (err) return res.send({ error: `${err}` })
				else res.json({
					time: new Date().getTime() - t0,
					total: total,
					totalPages: totalPages,
					page: page,
					pageResults: docs.length,
					results: docs
				})
      })
	}

	static async getById(req: Request, res: Response) {
		await Imdb.Movies
			.findById(req.params.id)
			.exec((err: NativeError, doc: Document[]) => {
				if (err) return res.send({ error: `${err}` })
				res.json({ results: doc })
			})
	}

	static async findByKeys(req: Request, res: Response) {
		const t0: number = new Date().getTime()
		const filters: any = Imdb.validateFindFilters(req.body, 'Movies')
		if (filters.fields.error) return res.send(filters.fields)

		Imdb.Movies
			.aggregate([
				{ $match: filters.fields },
				{ $sort: { metaScore: -1, year: -1 } },
				{ $facet: {
						'stage1': [ { '$group': { _id: '$id', count: { $sum: 1 } } } ],
						'stage2': [ { '$skip': (Imdb.limit * filters.page) }, { '$limit': Imdb.limit } ]
					}
				},
				{ $unwind: "$stage1" },
				{ $project: {
						count: '$stage1.count',
						results: '$stage2'
					}
				}
			])
			.allowDiskUse(true)
			.exec((err: NativeError, docs: Document[]) => {
				if (err) return res.send({ error: `${err}` })
				res.json({
					time: new Date().getTime() - t0,
					// @ts-ignore: unreachable aggregation key
					total: docs[0] ? docs[0].count : null,
					// @ts-ignore: unreachable aggregation key
					totalPages: docs[0] ?
						// @ts-ignore: unreachable aggregation key
						(docs[0].count > Imdb.limit ? (parseInt(docs[0].count / Imdb.limit) + 1) : 1) :
						null,
					page: filters.page + 1,
					// @ts-ignore: unreachable aggregation key
					pageResults: docs[0] ? docs[0].results.length : null,
					// @ts-ignore: unreachable aggregation key
					results: docs[0] ? docs[0].results : null,
				})
			})
	}
}

export default MoviesController
