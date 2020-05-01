/** ****** SERVER ****** **/
import { Request, Response, RequestHandler } from 'express'
/** ****** NODE ****** **/
import _ from 'lodash'
/** ****** INTERNALS ****** **/
import IMDBDatasetService from '../../services/IMDBDatasetService'

class SearchController {
  static search(req: Request, res: Response) {
    const level: string = process.env.NODE_ENV === 'production' ? 'live' : 'sample'
    let { names, filters } = req.body
    let movies: any[]
    let series: any[]

    if (names) {
      names = JSON.parse(names)

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
    }

    if (filters) {
      filters = JSON.parse(filters)

      if (filters.year) {
        // year: { min: 1950, max: 2020 },

      }

      if (filters.rating) {
        // rating: { min: 0, max: 10 },

      }

      if (filters.metaScore) {
        // metaScore: { min: 0, max: 100 },

      }

      if (filters.certificate) {
        // certificate: ["Tous Publics", "Tous Publics (avec avertissement)", "0+", "6+", "9+", "10", "12", "14+", "16", "18", "X"],

      }

      if (filters.runtime) {
        // runtime: { min: 5, max 500 },

      }

      if (filters.genres) {
        // genres: Genres,

      }

      if (filters.gross) {
        // gross: { min: 0, max: ""$1000M" }

      }
    }

    res.json({
      results: {
        // @ts-ignore: unreachable key
        movies: _.chunk(movies ? movies : IMDBDatasetService[`${level}Movies`].data, 20),
        // @ts-ignore: unreachable key
        series: _.chunk(series ? series : IMDBDatasetService[`${level}Series`].data, 20)
      }
    })
  }
}

export default SearchController

/*****
  req.body = {
    names: {
      title: "sometitle",
      actors: [{id: peopleid}],
      directors: [{id: peopleid}],
    },
    filters: {
      year: { min: 1950, max: 2020 },
      rating: { min: 0, max: 10 },
      metaScore: { min: 0, max: 100 },
      certificate: ["Tous Publics", "Tous Publics (avec avertissement)", "0+", "6+", "9+", "10", "12", "14+", "16", "18", "X"],
      runtime: { min: 5, max 500 },
      genres: Genres,
      gross: { min: 0, max: ""$1000M" }
    }
  }

******/

/******
{
    "id": "tt0133093",
    "title": "Matrix",
    "year": 1999,
    "rating": 8,
    "nbRatings": 1,
    "metaScore": 73,
    "certificate": "Tous publics",
    "runtime": 136,
    "genres": [
        {
            "name": "Action"
        },
        {
            "name": "Sci-Fi"
        }
    ],
    "description": "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    "picture": "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@.jpg",
    "directors": [
        {
            "id": "nm0905154",
            "name": "Lana Wachowski"
        },
        {
            "id": "nm0905152",
            "name": "Lilly Wachowski"
        }
    ],
    "actors": [
        {
            "id": "nm0000206",
            "name": "Keanu Reeves"
        },
        {
            "id": "nm0000401",
            "name": "Laurence Fishburne"
        },
        {
            "id": "nm0005251",
            "name": "Carrie-Anne Moss"
        },
        {
            "id": "nm0915989",
            "name": "Hugo Weaving"
        }
    ],
    "gross": "$171.48M"
}

*******/
