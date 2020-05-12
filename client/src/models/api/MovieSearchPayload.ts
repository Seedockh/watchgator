import { MinMax } from './MinMax';

export type ActorPayload = {
    id: string;
}

type CategoryPayload = {
    name: string;
}

export interface MovieSearchPayload {
    names?: {
        actors?: ActorPayload[]
        genres?: CategoryPayload[]
    }
    filters?: {
        year?: MinMax
        rating?: MinMax
        metaScore?: MinMax
        runtime?: MinMax
    }
    pageMovies?: number
    pageSeries?: number
    type?: 'movies' | 'series'
}
