import { BaseResponse } from './BaseResponse';
import { Serie } from './Serie';
import { Movie } from './Movie';

export interface MovieResponse {
    total: number
    time: number
    totalMovies: number
    totalSeries: number
    moviesPages: number
    seriesPages: number
    results: {
        movies: Movie[],
        series: Serie[]
    }
}
