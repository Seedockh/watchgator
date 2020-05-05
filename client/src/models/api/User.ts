import { Movie } from "./Movie"
import { Playlist } from "../Playlists";

export interface User {
  uuid: string
  nickname: string
  avatar?: string
  email: string
  movies: Movie[]
  playlists?: Playlist[]
}