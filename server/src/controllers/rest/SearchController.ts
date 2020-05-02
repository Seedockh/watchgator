/** ****** SERVER ****** **/
import { Request, Response, RequestHandler } from 'express'
/** ****** NODE ****** **/
import _ from 'lodash'
import performance from 'performance'
/** ****** INTERNALS ****** **/
import IMDBDatasetService from '../../services/IMDBDatasetService'
import { sLog } from '../../core/Log'

class SearchController {

  /** * @TODO: Refactoring for filters * **/
  static search(req: Request, res: Response) {
    const t0 = new Date()
    const level: string = process.env.NODE_ENV === 'production' ? 'live' : 'sample'
    let { names, filters } = req.body
    let movies: IMDBMedia[]
    let series: IMDBMedia[]

    try {
      if (names) {
        try { names = JSON.parse(names) }
        catch { throw new Error('Invalid names parameter. It must be JSON.stringify() to be readable by server.') }

        if (names.title) {
          movies = _.filter(
            // @ts-ignore: unreachable key
            IMDBDatasetService[`${level}Movies`].data,
            movie => (new RegExp(names.title, 'i')).test(movie.title)
          )
          series = _.filter(
            // @ts-ignore: unreachable key
            IMDBDatasetService[`${level}Series`].data,
            serie => (new RegExp(names.title, 'i')).test(serie.title)
          )
        }

        if (names.actors) {
          names.actors.forEach((actor: IMDBPerson) => {
            movies = _.filter(
              // @ts-ignore: unreachable key
              movies ? movies : IMDBDatasetService[`${level}Movies`].data,
              movie => _.some(movie.actors, { id: actor.id })
            )
          })
          names.actors.forEach((actor: IMDBPerson) => {
            series = _.filter(
              // @ts-ignore: unreachable key
              series ? series : IMDBDatasetService[`${level}Series`].data,
              serie => _.some(serie.directors, { id: actor.id })
            )
          })
        }

        if (names.directors) {
          names.directors.forEach((director: IMDBPerson) => {
            movies = _.filter(
              // @ts-ignore: unreachable key
              movies ? movies : IMDBDatasetService[`${level}Movies`].data,
              movie => _.some(movie.directors, { id: director.id })
            )
          })
        }


        if (names.genres) {
          names.genres.forEach((genre: IMDBCategory) => {
            movies = _.filter(
              // @ts-ignore: unreachable key
              movies ? movies : IMDBDatasetService[`${level}Movies`].data,
              movie => _.some(movie.genres, { name: genre.name })
            )
          })
          names.genres.forEach((genre: IMDBCategory) => {
            series = _.filter(
              // @ts-ignore: unreachable key
              series ? series : IMDBDatasetService[`${level}Series`].data,
              serie => _.some(serie.genres, { name: genre.name })
            )
          })
        }
      }

      if (filters) {
        try { filters = JSON.parse(filters) }
        catch { throw new Error('Invalid filters parameter. It must be JSON.stringify() to be readable by server.') }

        if (filters.year) {
          movies = _.filter(
            // @ts-ignore: unreachable key
            movies ? movies : IMDBDatasetService[`${level}Movies`].data,
            movie => movie.year >= filters.year.min && movie.year <= filters.year.max
          )
          series = _.filter(
            // @ts-ignore: unreachable key
            series ? series : IMDBDatasetService[`${level}Series`].data,
            serie => serie.year >= filters.year.min && serie.year <= filters.year.max
          )
        }

        if (filters.rating) {
          movies = _.filter(
            // @ts-ignore: unreachable key
            movies ? movies : IMDBDatasetService[`${level}Movies`].data,
            movie => movie.rating >= filters.rating.min && movie.rating <= filters.rating.max
          )
          series = _.filter(
            // @ts-ignore: unreachable key
            series ? series : IMDBDatasetService[`${level}Series`].data,
            serie => serie.rating >= filters.rating.min && serie.rating <= filters.rating.max
          )
        }

        if (filters.metaScore) {
          movies = _.filter(
            // @ts-ignore: unreachable key
            movies ? movies : IMDBDatasetService[`${level}Movies`].data,
            movie => movie.metaScore >= filters.metaScore.min && movie.metaScore <= filters.metaScore.max
          )
          series = _.filter(
            // @ts-ignore: unreachable key
            series ? series : IMDBDatasetService[`${level}Series`].data,
            serie => serie.metaScore >= filters.metaScore.min && serie.metaScore <= filters.metaScore.max
          )
        }

        if (filters.nbRatings) {
          // nbRatings: {min: 0, max: 1000000},
          /** @TODO */
        }

        if (filters.certificate) {
          // certificate: ["Tous Publics", "Tous Publics (avec avertissement)", "0+", "6+", "9+", "10", "12", "14+", "16", "18", "X"],
          /** @TODO */
        }

        if (filters.runtime) {
          movies = _.filter(
            // @ts-ignore: unreachable key
            movies ? movies : IMDBDatasetService[`${level}Movies`].data,
            movie => movie.runtime >= filters.runtime.min && movie.runtime <= filters.runtime.max
          )
          series = _.filter(
            // @ts-ignore: unreachable key
            series ? series : IMDBDatasetService[`${level}Series`].data,
            serie => serie.runtime >= filters.runtime.min && serie.runtime <= filters.metaScore.max
          )
        }

        if (filters.gross) {
          // gross: { min: 0, max: ""$1000M" }
          /** @TODO */
        }
      }

      // @ts-ignore: unreachable key
      const totalMovies = movies ? movies.length : IMDBDatasetService[`${level}Movies`].data.length
      // @ts-ignore: unreachable key
      const totalSeries = series ? series.length : IMDBDatasetService[`${level}Series`].data.length
      // @ts-ignore: unreachable key
      const resultMovies = _.chunk(movies ? movies : IMDBDatasetService[`${level}Movies`].data, 20)
      // @ts-ignore: unreachable key
      const resultSeries = _.chunk(series ? series : IMDBDatasetService[`${level}Series`].data, 20)

      const time = new Date() - t0
      sLog(`[${(new Date).toLocaleDateString()}-${(new Date).toLocaleTimeString()}] Search reached ${totalMovies+totalSeries} results in ${time}ms`, 'FFA500')
      res.json({
        total: totalMovies + totalSeries,
        time: time,
        totalMovies: totalMovies,
        totalSeries: totalSeries,
        moviesPages: resultMovies.length,
        seriesPages: resultSeries.length,
        results: {
          movies: resultMovies,
          series: resultSeries
        }
      })
    } catch (error) {
      sLog(`[${(new Date).toLocaleDateString()}-${(new Date).toLocaleTimeString()}] Search error: ${error}`, 'FF0000')
      res.json({ error: true, message: `${error}` })
    }

  }
}

export default SearchController
