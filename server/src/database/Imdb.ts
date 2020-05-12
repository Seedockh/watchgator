/** ****** DATABASE ****** **/
import mongoose, { Model, NativeError, Document } from 'mongoose'
import { Movie } from './schemas/Movie'
import { Serie } from './schemas/Serie'
import { People } from './schemas/People'
import { Genre } from './schemas/Genre'
/** ****** TYPES ****** **/
import { Ora } from 'ora'
/** ****** INTERNALS ****** **/
import { sLog, aLog } from '../core/Log'

class Imdb {
  static spinner: Ora
  static mongodb: number
  static limit = 20
  static Movies: Model<Document>
  static Series: Model<Document>
  static Peoples: Model<Document>
  static Genres: Model<Document>

  static async boot() {
    Imdb.spinner = aLog('Connecting to IMDB datas ...')

    try {
      const db = await mongoose.connect(
        `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@ds211168.mlab.com:11168/heroku_fgdfgjch`,
        { useNewUrlParser: true, useUnifiedTopology: true }
      )

      Imdb.Movies = await db.model('movies', Movie)
      Imdb.Series = await db.model('series', Serie)
      Imdb.Peoples = await db.model('peoples', People)
      Imdb.Genres = await db.model('genres', Genre)

      Imdb.spinner.succeed('IMDB datas connected.')
    } catch (err) {
      Imdb.spinner.fail(`Mongodb Error : ${err}`)
    }
  }

  static validateFindFilters(body: any, type = 'Movies') {
    // @ts-ignore: unreachable key
    const paths = { ...Imdb[`${type}`].schema.paths }
    const matchCase = body.matchCase ? '' : 'i'
    const page = parseInt(body.page) > 0 ? parseInt(body.page) - 1 : 0
    let types = {}
    let filters = {} //{ metaScore: { $ne: null } }

    Object.entries(paths).forEach(path => {
      // @ts-ignore: unreachable key
      return types[path[0]] = path[1].instance.toLowerCase()
    })

    Object.entries(body).forEach((key: any[]) => {
      if (key[0] !== 'matchCase' && key[0] !== 'page') {
        if (key[0] === 'fullname') {
  				const names = key[1].split(' ')
          // @ts-ignore: unreachable key
  				filters.firstname = { $regex: new RegExp(names[0]), $options: matchCase }
          // @ts-ignore: unreachable key
  				filters.lastname  = { $regex: new RegExp(names[1]), $options: matchCase }
        }

        // @ts-ignore: unreachable key
        if (!types[key[0]] && key[0] !== 'fullname')
          return filters = { error: `${key[0]} is not a known property` }

        // @ts-ignore: unreachable key
        if (types[key[0]] === 'string') {
          if (!isNaN(key[1]))
            return filters = { error: `Wrong type value for ${key[0]}` }

          // @ts-ignore: unreachable key
          if (types[key[0]] === 'string' && key[1].length < 3)
            return filters = { error: `${key[0]} field must be at least 3 characters long` }

          // @ts-ignore: unreachable key
          return filters[key[0]] = { $regex: new RegExp(key[1]), $options: matchCase }
        }

        // @ts-ignore: unreachable key
        if (types[key[0]] === 'number') {
          if (isNaN(key[1]))
            return filters = { error: `Wrong type value for ${key[0]}` }

          if (key[1] < 0)
            return filters = { error: `${key[0]} field must be at least 0` }

          const number = Number.isInteger(key[1]) ? parseInt(key[1]) : parseFloat(key[1])
          // @ts-ignore: unreachable key
          return filters[key[0]] = { $gte: number }
        }
      }
    })

    return { page: page, fields: filters }
  }

  static async validateSearchFilters(body: SearchPayload) {
    const { names, filters, pageMovies, pageSeries } = body
    const errors: any[] = []
    let fields: Record<string, any> = { $and: [] }

    if (names) {
      await Object.entries(names).forEach(name => {
        // @ts-ignore: unreachable key
        if (name[0] === 'actors') {
          let actorsFields = { actors: { $elemMatch: { $or: [] } } }
          // @ts-ignore: unreachable key
          name[1].map(fieldId => actorsFields.actors.$elemMatch.$or.push({ id: fieldId.id }) )
          // @ts-ignore: unreachable key
          return fields.$and.push(actorsFields)
        }

        // @ts-ignore: unreachable key
        else if (name[0] === 'directors') {
          let directorsFields = { directors: { $elemMatch: { $or: [] } } }
          // @ts-ignore: unreachable key
          name[1].map(fieldId => directorsFields.directors.$elemMatch.$or.push({ id: fieldId.id }) )
          // @ts-ignore: unreachable key
          return fields.$and.push(directorsFields)
        }

        // @ts-ignore: unreachable key
        else if (name[0] === 'genres') {
          let genresFields = { genres: { $elemMatch: { $or: [] } } }
          // @ts-ignore: unreachable key
          name[1].map(fieldId => genresFields.genres.$elemMatch.$or.push({ name: fieldId.name }) )
          // @ts-ignore: unreachable key
          return fields.$and.push(genresFields)
        }

        // @ts-ignore: unreachable key
        else return errors[name[0]] = `${name[0]} is not a valid name field.`
      })
    } else fields.$and.push({})

    if (filters) {
      await Object.entries(filters).forEach(filter => {
        if (!isNaN(filter[1].min) &&
        !isNaN(filter[1].max) &&
        (filter[0] === 'year' ||
        filter[0] === 'rating' ||
        filter[0] === 'nbRatings' ||
        filter[0] === 'metaScore' ||
        filter[0] === 'runtime')
      ) {
          let filterField = {}
          // @ts-ignore: unreachable key
          filterField[filter[0]] = { $gte: filter[1].min, $lte: filter[1].max }
          // @ts-ignore: unreachable key
          return fields.$and.push(filterField)
        } else return errors[name[0]] = `${filter[0]} is not a valid filter field.`
      })
    } else fields.$and.push({})

    return {
      fields: fields,
      error: errors.length > 0 ? errors : null,
      pageMovies: pageMovies ? pageMovies - 1 : 0,
      pageSeries: pageSeries ? pageSeries - 1 : 0
    }
  }
}

export default Imdb
