import { BaseResponse } from './BaseResponse';
import { Serie } from './Serie';
import { Movie } from './Movie';

export interface MovieResponse {
    time: number,
    totalMovies: number,
    totalSeries: number,
    totalMoviesPages: number,
    totalSeriesPages: number,
    pageMovies: number,
    pageSeries: number,
    pageMoviesResults: number,
    pageSeriesResults: number,
    results: {
        movies: Movie[],
        series: Serie[]
    }
}
