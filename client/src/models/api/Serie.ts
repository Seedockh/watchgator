import { People } from './People';
import { Genre } from './Genre';

export interface Serie {
    id: string
    title: string
    year: number
    rating: string | null
    nbRatings: string | null
    metaScore: string | null
    certificate: string | null
    runtime: number | null
    genres: Genre[],
    description: string
    picture: string
    directors: People[],
    actors: People[],
    gross: string | null
}