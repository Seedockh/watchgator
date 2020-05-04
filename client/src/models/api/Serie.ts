import { Actor } from './../Actor';

export interface Serie {
    id: string
    title: string
    year: number
    rating: string
    nbRatings: string
    metaScore: string
    certificate: string
    runtime: number
    genres: [
        {
            name: string
        }
    ],
    description: string
    picture: string
    directors: [
        {
            id: string
            name: string
        }
    ],
    actors: Actor[],
    gross: string
}