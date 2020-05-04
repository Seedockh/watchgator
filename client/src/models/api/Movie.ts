import { Actor } from './../Actor'

export interface Movie {
    id: string
    title: string
    year: number
    rating: number
    nbRatings: number
    metaScore: number
    certificate: string
    runtime: number
    genre: [
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