/** ****** SERVER ****** **/
import { Request, Response, RequestHandler } from 'express'
/** ****** DATABASE ******* **/
import { NativeError, Document } from 'mongoose'
/** ****** INTERNALS ****** **/
import Imdb from '../../database/Imdb'
import { sLog } from '../../core/Log'

class SearchController {
	static async search(req: Request, res: Response) {
		const t0: number = new Date().getTime()
		const search = await Imdb.validateSearchFilters(req.body)
		const typeSelected = req.body.type === 'movies' ? 0 : (req.body.type === 'series' ? 2 : 1)

		if (search.error) return res.send(search.fields)

		await Imdb.Movies
			.aggregate([
				{ $match: typeSelected <= 1 ? search.fields : { _id: null } },
				{ $facet: {
						'stage1': [ { '$group': { _id: null, count: { $sum: 1 } } } ],
						'stage2': [ { '$skip': (Imdb.limit * search.pageMovies) }, { '$limit': Imdb.limit } ]
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
			.exec(async (err: NativeError, moviesDocs: Document[]) => {
				if (err) return res.send({ error: `${err}` })
				else await Imdb.Series
					.aggregate([
						{ $match: typeSelected >= 1 ? search.fields : { _id: null } },
						{ $facet: {
								'stage1': [ { '$group': { _id: null, count: { $sum: 1 } } } ],
								'stage2': [ { '$skip': (Imdb.limit * search.pageSeries) }, { '$limit': Imdb.limit } ]
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
					.exec((err: NativeError, seriesDocs: Document[]) => {
						if (err) return res.send({ error: `${err}` })
						else {
							try {
								const time = new Date().getTime() - t0
								// @ts-ignore: unreachable key
								sLog(`[${new Date().toLocaleDateString()}-${new Date().toLocaleTimeString()}] Search reached ${(moviesDocs.length > 0 ? moviesDocs[0].count : 0) + (seriesDocs.length > 0 ? seriesDocs[0].count : 0)} results in ${time}ms`,
									'FFA500',
								)

								return res.json({
									time: time,
									// @ts-ignore: unreachable key
									totalMovies: moviesDocs.length > 0 ? moviesDocs[0].count : 0,
									// @ts-ignore: unreachable key
									totalSeries: seriesDocs.length > 0 ? seriesDocs[0].count : 0,
									totalMoviesPages: moviesDocs.length > 0 ?
										// @ts-ignore: unreachable key
										(moviesDocs[0].count > Imdb.limit ? (parseInt(moviesDocs[0].count / Imdb.limit) + 1) : 1) :
										0,
									totalSeriesPages: seriesDocs.length > 0 ?
										// @ts-ignore: unreachable key
										(seriesDocs[0].count > Imdb.limit ? (parseInt(seriesDocs[0].count / Imdb.limit) + 1) : 1) :
										0,
									pageMovies: search.pageMovies + 1,
									pageSeries: search.pageSeries + 1,
									// @ts-ignore: unreachable key
									pageMoviesResults: moviesDocs.length > 0 ? moviesDocs[0].results.length : 0,
									// @ts-ignore: unreachable key
									pageSeriesResults: seriesDocs.length > 0 ? seriesDocs[0].results.length : 0,
									results: {
										// @ts-ignore: unreachable key
										movies: moviesDocs.length > 0 ? moviesDocs[0].results : [],
										// @ts-ignore: unreachable key
										series: seriesDocs.length > 0 ? seriesDocs[0].results : [],
									}
								})
							} catch (e) {
								res.send(`Response error : ${e}`)
							}
						}
					})
			})
	}
}

export default SearchController
