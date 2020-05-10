/** ****** DATABASE ****** **/
import { Schema } from 'mongoose'

export const Genre: Schema = new Schema({ _id: String }, { collection: 'genres' })

export const RelatedGenre: Schema = new Schema({ name: String })
