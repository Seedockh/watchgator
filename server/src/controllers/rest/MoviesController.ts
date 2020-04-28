/** ****** SERVER ****** **/
import { Request, Response, RequestHandler } from 'express'
/** ****** NODE ****** **/
import _ from 'lodash'
/** ****** INTERNALS ****** **/
import IMDBService from '../../services/IMDBService'

class MoviesController {

  static async getAll(req: Request, res: Response) {
    res.json(process.env.NODE_ENV === 'production' ?
      _.chunk(IMDBService.liveMovies.data, 20) :
      _.chunk(IMDBService.sampleMovies.data, 20)
    )
  }

  static getAllByPage(req: Request, res: Response) {
    const page = req.params.page
    const start = 20 * page
    const end = start + 20

    res.json(process.env.NODE_ENV === 'production' ?
      _.slice(IMDBService.liveMovies.data, start, end) :
      _.slice(IMDBService.sampleMovies.data, start, end)
    )
  }

  static getTitle(req: Request, res: Response) {
    res.json({ params: req.params })
  }
}

export default MoviesController
