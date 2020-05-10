/** ****** DATABASE ****** **/
import { Schema } from 'mongoose'

export const People: Schema = new Schema({
  _id: String,
  firstname: String,
  lastname: String,
  picture: String,
  role: String
}, { collection: 'peoples' })

export const RelatedPeople: Schema = new Schema({
  id: String,
  name: String
})
