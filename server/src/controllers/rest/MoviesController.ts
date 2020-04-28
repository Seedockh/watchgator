/** ****** SERVER ****** **/
import { Request, Response, RequestHandler } from 'express'
/** ****** NODE ****** **/
import _ from 'lodash'
/** ****** INTERNALS ****** **/
import IMDBService from '../../services/IMDBService'

class MoviesController {

  /**
   * @swagger
   *  components:
   *    schemas:
   *      Movies:
   *        type: array
   *        properties:
   *          title:
   *            type: string
   *            description: title of the movie
   *          year:
   *            type: string
   *            description: year of release
   *          rating:
   *            type: string
   *            description: IMDB rating
   *          nbRatings:
   *            type: string
   *            description: number of ppl that rated the movie
   *          metaScore:
   *            type: string
   *            description: IMDB popularity score
   *          certificate:
   *            type: string
   *            description: for which public is addressed the movie
   *          runtime:
   *            type: string
   *            description: duration of the movie
   *          genre:
   *            type: string
   *            description: category(ies) of the movie
   *          description:
   *            type: string
   *            description: short synopsis
   *          picture:
   *            type: string
   *            description: picture URL
   *          director:
   *            type: string
   *            description: main director name
   *          casting:
   *            type: array<string>
   *            description: list of the actors
   *          gross:
   *            type: string
   *            description: total budget of the movie
   *        example:
   *              title: "Parasite"
   *              year: "2019"
   *              rating: "8.6"
   *              nbRatings: "382,763"
   *              metaScore: "96"
   *              certificate: "R"
   *              runtime: "132 min"
   *              genre: "Comedy, Drama, Thriller"
   *              description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan."
   *              picture: "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@.jpg"
   *              director: "Bong Joon Ho"
   *              casting: [
   *                  Kang-ho Song,
   *                  Sun-kyun Lee,
   *                  Yeo-jeong Jo,
   *                  Woo-sik Choi
   *              ]
   *              gross: "$53.37M"
   * path:
   *  /movies/all/:
   *    get:
   *      summary: Get all Movies, chunked by arrays of 20 movies arrays. Example: for 100 Movies, returns 5 arrays
   *      tags: [Movies]
   */
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
