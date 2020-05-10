/** ****** DATABASE ****** **/
import { Schema } from 'mongoose'
/** ****** SCHEMAS ****** **/
import { RelatedGenre } from './Genre'
import { RelatedPeople } from './People'

export const Serie: Schema = new Schema({
  _id: String,
  title: String,
  year: Number,
  rating: Number,
  nbRatings: Number,
  metaScore: Number,
  certificate: Number,
  runtime: Number,
  genres: [RelatedGenre],
  description: Number,
  picture: Number,
  directors: [RelatedPeople],
  actors: [RelatedPeople],
  gross: Number
}, { collection: 'series' })
