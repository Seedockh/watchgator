/** ****** SERVER ****** **/
import { Request, Response, RequestHandler } from 'express'
/** ****** DATABASE ******* **/
import { NativeError, Document } from 'mongoose'
/** ****** INTERNALS ****** **/
import Imdb from '../../database/Imdb'
import { sLog } from '../../core/Log'

class PeoplesController {
	static async getAll(req: Request, res: Response) {
		const total = await Imdb.Genres.countDocuments()

		await Imdb.Genres.find().exec((err: NativeError, docs: Document[]) => {
      if (err) res.send(`Error: ${err}`)
			else res.json({	total: total,	results: docs	})
    })
	}
}

export default PeoplesController
