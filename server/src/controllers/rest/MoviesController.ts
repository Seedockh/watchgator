/** ****** SERVER ****** **/
import { Request, Response, RequestHandler } from 'express'
/** ****** DATABASE ******* **/
import { NativeError, Document } from 'mongoose'
/** ****** INTERNALS ****** **/
import Imdb from '../../database/Imdb'
import { sLog } from '../../core/Log'

class MoviesController {
	static async getAll(req: Request, res: Response) {
		const page = parseInt(req.params.page) > 0 ? parseInt(req.params.page) : 1
		const total = await Imdb.Movies.countDocuments()
		const totalPages = (total / Imdb.limit)

		await Imdb.Movies
			.find()
			.limit(Imdb.limit)
			.skip(Imdb.limit * (page - 1))
      .exec((err: NativeError, docs: Document[]) => {
        if (err) res.send(`Error: ${err}`)
				else res.json({
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
				if (err) return res.send(`Error: ${err}`)
				res.json({ results: doc })
			})
	}

	static async findByKeys(req: Request, res: Response) {
		const filters: any = Imdb.validateMediaFindFilters(req.body)
		if (filters.error) return res.send(filters)

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
					total: docs[0].count,
					totalPages: docs[0].count > Imdb.limit ? (parseInt(docs[0].count / Imdb.limit)) : 1,
					page: filters.page + 1,
					pageResults: Imdb.limit,
					results: docs[0].results
				})
			})
	}
}

export default MoviesController
