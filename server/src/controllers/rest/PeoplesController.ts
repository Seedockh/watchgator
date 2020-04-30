/** ****** SERVER ****** **/
import { Request, Response, RequestHandler } from 'express'
/** ****** NODE ****** **/
import _ from 'lodash'
/** ****** INTERNALS ****** **/
import IMDBDatasetService from '../../services/IMDBDatasetService'

class PeoplesController {
  static getAll(req: Request, res: Response) {
    res.json(process.env.NODE_ENV === 'production' ?
      _.chunk(IMDBDatasetService.livePeoples.data, 20) :
      _.chunk(IMDBDatasetService.samplePeoples.data, 20)
    )
  }

  static getAllByPage(req: Request, res: Response) {
    const page = parseInt(req.params.page)
    const start = 20 * page
    const end = start + 20

    res.json(process.env.NODE_ENV === 'production' ?
      _.slice(IMDBDatasetService.livePeoples.data, start, end) :
      _.slice(IMDBDatasetService.samplePeoples.data, start, end)
    )
  }

  static getById(req: Request, res: Response) {
    res.json(process.env.NODE_ENV === 'production' ?
      _.find(IMDBDatasetService.livePeoples.data, { id: req.params.id }) :
      _.find(IMDBDatasetService.samplePeoples.data, { id: req.params.id })
    )
  }

  static findByKeys(req: Request, res: Response) {
    const keys = { ...req.body }

    let filters = {}
    Object.entries(keys).forEach(key => filters[key[0]] = new RegExp(key[1], 'i'))

    res.json({ results: _.chunk(
      _.filter(
        process.env.NODE_ENV === 'production' ?
          IMDBDatasetService.livePeoples.data :
          IMDBDatasetService.samplePeoples.data,
        movie => {
          for (const key in filters) {
            if (filters[key].test(movie[key])) return true
          }
        }
      ), 20)
    })
  }
}

export default PeoplesController
