/** ****** SERVER ****** **/
import { Request, Response, RequestHandler } from 'express'
/** ****** NODE ****** **/
import _ from 'lodash'
/** ****** INTERNALS ****** **/
import IMDBDatasetService from '../../services/IMDBDatasetService'

class MoviesController {
<<<<<<< HEAD
<<<<<<< HEAD
  static getAll(req: Request, res: Response) {
=======

=======
>>>>>>> move docs to specific yml files
  static async getAll(req: Request, res: Response) {
>>>>>>> add getAll and getAllByPage movies routes
    res.json(process.env.NODE_ENV === 'production' ?
      _.chunk(IMDBDatasetService.liveMovies.data, 20) :
      _.chunk(IMDBDatasetService.sampleMovies.data, 20)
    )
  }

  static getAllByPage(req: Request, res: Response) {
<<<<<<< HEAD
    const page = parseInt(req.params.page)
=======
    const page = req.params.page
>>>>>>> add getAll and getAllByPage movies routes
    const start = 20 * page
    const end = start + 20

    res.json(process.env.NODE_ENV === 'production' ?
      _.slice(IMDBDatasetService.liveMovies.data, start, end) :
      _.slice(IMDBDatasetService.sampleMovies.data, start, end)
    )
  }

<<<<<<< HEAD
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
=======
  static getTitle(req: Request, res: Response) {
    res.json({ params: req.params })
>>>>>>> add getAll and getAllByPage movies routes
  }
}

export default MoviesController
