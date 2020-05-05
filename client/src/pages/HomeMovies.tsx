import React, { useEffect, CSSProperties, useState, FunctionComponent } from 'react'
import { Grid, Row, Col, Panel, Loader } from 'rsuite'
import { MovieCard } from '../widget/MovieCard'
import { MovieFilter } from '../models/MovieFilter'
import { Movie } from '../models/api/Movie'
import { useApiFetch } from '../hooks/api/useApiFetch'
import { MovieResponse } from '../models/api/MoviesResponse'
import { searchMovies } from '../core/api/Api'
import { Serie } from '../models/api/Serie'
import { MovieTVShowSwitch, SwitchValue } from '../widget/MovieTVShowSwitch'
import { LoaderRowCenter } from '../widget/LoaderRowCenter'

const loaderStyle: CSSProperties = {
    width: 100,
    marginLeft: '40%',
    marginTop: '10em'
}

type HomeMoviesProps = {
    filters?: MovieFilter
}

export const HomeMovies: FunctionComponent<HomeMoviesProps> = ({ filters }) => {
    const [tab, setTab] = useState<SwitchValue>('movies')
    //const [currentPage, setCurrentPage] = useState(1)
    const moviesFetch = useApiFetch<MovieResponse>()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { onFiltersChange() }, [filters])

    const onFiltersChange = (filters?: MovieFilter) => {
        moviesFetch.setLoading(true)
        searchMovies(filters ? {
            names: {
                actors: filters.actors,
                genres: filters.categories.map((c) => ({ name: c }))
            },
            filters: {
                year: filters.years,
                rating: filters.rating,
                runtime: filters.runtime,
                metaScore: filters.metaScore
            }
        } : {})
            .then(moviesFetch.setData)
            .catch(moviesFetch.setError)
    }

    let movies: Movie[] = [];
    let series: Serie[] = [];
    if (moviesFetch.data && moviesFetch.data.results) {
        if (moviesFetch.data.results.movies) {
            movies = moviesFetch.data.results.movies
        }
        if (moviesFetch.data.results.series) {
            series = moviesFetch.data.results.series
        }
    }

    return (
        <Panel className="mb-6">
            <h1 className="ml-4">
                <MovieTVShowSwitch type={tab} onSwitch={setTab} />
            </h1>
            <Grid fluid >
                {moviesFetch.isLoading
                    ? <LoaderRowCenter />
                    : <Row>
                        {(tab === 'movies' ? movies : series).map((item) => (
                            <Col key={item.id} xs={24} sm={12} md={6} lg={4} >
                                <MovieCard movie={item} />
                            </Col>
                        ))}
                    </Row>
                }
            </Grid>
        </Panel>
    );
}

/*<InfiniteScroll
    pageStart={currentPage}
    loadMore={() => setCurrentPage(currentPage + 1)}
    hasMore={data ? (currentPage <= data.moviesPages) : false}
    loader={<Loader size="lg"/>}
  >
</InfiniteScroll>*/