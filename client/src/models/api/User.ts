import { Movie } from "./Movie"

export interface User {
  uuid: string
  nickname: string
  avatar?: string
  email: string
  movies: Movie[]
}