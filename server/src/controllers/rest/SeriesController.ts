/** ****** SERVER ****** **/
import { Request, Response, RequestHandler } from 'express'
/** ****** DATABASE ******* **/
import { NativeError, Document } from 'mongoose'
/** ****** INTERNALS ****** **/
import Imdb from '../../database/Imdb'
import { sLog } from '../../core/Log'

class SeriesController {
	static async getAll(req: Request, res: Response) {
		const t0: number = new Date().getTime()
		const page = parseInt(req.params.page) > 0 ? parseInt(req.params.page) : 1
		const total = await Imdb.Series.countDocuments()
		const totalPages = (total / Imdb.limit)

		await Imdb.Series
			.find()
			.limit(Imdb.limit)
			.skip(Imdb.limit * (page - 1))
      .exec((err: NativeError, docs: Document[]) => {
        if (err) res.send(`Error: ${err}`)
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
		await Imdb.Series
			.findById(req.params.id)
			.exec((err: NativeError, doc: Document[]) => {
				if (err) return res.send(`Error: ${err}`)
				res.json({ results: doc })
			})
	}

	static async findByKeys(req: Request, res: Response) {
		const t0: number = new Date().getTime()
		const filters: any = Imdb.validateMediaFindFilters(req.body, 'series')
		if (filters.error) return res.send(filters)

		Imdb.Series
			.aggregate([
				{ $match: filters.fields },
				{ $sort: { rating: -1, nbRatings: -1 } },
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
					total: docs[0].count,
					// @ts-ignore: unreachable aggregation key
					totalPages: docs[0].count > Imdb.limit ? (parseInt(docs[0].count / Imdb.limit) + 1) : 1,
					page: filters.page + 1,
					// @ts-ignore: unreachable aggregation key
					pageResults: docs[0].results.length,
					// @ts-ignore: unreachable aggregation key
					results: docs[0].results
				})
			})
	}
}

export default SeriesController
