/** ****** SERVER ****** **/
import { Request, Response, RequestHandler } from 'express'
/** ****** NODE ****** **/
import _ from 'lodash'
/** ****** INTERNALS ****** **/
import IMDBDatasetService from '../../services/IMDBDatasetService'

class MoviesController {
  static getAll(req: Request, res: Response) {
    res.json(process.env.NODE_ENV === 'production' ?
      _.chunk(IMDBDatasetService.liveMovies.data, 20) :
      _.chunk(IMDBDatasetService.sampleMovies.data, 20)
    )
  }

  static getAllByPage(req: Request, res: Response) {
    const page = parseInt(req.params.page)
    const start = 20 * page
    const end = start + 20

    res.json(process.env.NODE_ENV === 'production' ?
      _.slice(IMDBDatasetService.liveMovies.data, start, end) :
      _.slice(IMDBDatasetService.sampleMovies.data, start, end)
    )
  }

  static findByKeys(req: Request, res: Response) {
    const keys = { ...req.body }

    res.json({ results: _.chunk(
      _.filter(
        process.env.NODE_ENV === 'production' ?
          IMDBDatasetService.liveMovies.data :
          IMDBDatasetService.sampleMovies.data,
        keys
      ), 20)
    })
  }
}

export default MoviesController
