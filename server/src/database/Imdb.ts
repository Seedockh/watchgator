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
        // @ts-ignore: unreachable key
        if (!types[key[0]])
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
}

export default Imdb
