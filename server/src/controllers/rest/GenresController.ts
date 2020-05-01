/** ****** SERVER ****** **/
import { Request, Response, RequestHandler } from 'express'
/** ****** NODE ****** **/
import _ from 'lodash'
/** ****** INTERNALS ****** **/
import IMDBDatasetService from '../../services/IMDBDatasetService'

class PeoplesController {
	static getAll(req: Request, res: Response) {
		res.json(
			process.env.NODE_ENV === 'production'
				? IMDBDatasetService.liveGenres.data
				: IMDBDatasetService.sampleGenres.data,
		)
	}
}

export default PeoplesController
