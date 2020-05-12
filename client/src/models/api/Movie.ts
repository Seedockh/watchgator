import { Genre } from "./Genre";
import { People } from "./People";

export interface Movie {
    _id: string
    title: string
    year: number
    rating: number | null
    nbRatings: number | null
    metaScore: number | null
    certificate: string | null
    runtime: number | null
    genres: Genre[],
    description: string | null
    picture: string
    directors: People[],
    actors: People[],
    gross: string | null
}
