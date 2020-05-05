import React, { useEffect, useState, FunctionComponent } from 'react'
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
import { MovieSearchPayload } from '../models/api/MovieSearchPayload'
import InfiniteScroll from 'react-infinite-scroller'

type HomeMoviesProps = {
    filters?: MovieFilter
}

export const HomeMovies: FunctionComponent<HomeMoviesProps> = ({ filters }) => {
    const [tab, setTab] = useState<SwitchValue>('movies')
    const moviesFetch = useApiFetch<MovieResponse>()
    const seriesFetch = useApiFetch<MovieResponse>()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { onFiltersChange() }, [filters])

    const onFiltersChange = () => {
        moviesFetch.setLoading(true)
        fetchMovies(1, true)
        fetchSeries(1, true)
    }

    const getSearchPayload = (): MovieSearchPayload => {
        if (!filters) return {};
        return {
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
        }
    }

    const fetchMovies = (page: number, reset: boolean) => {
        // Fetch movies
        searchMovies({ ...getSearchPayload(), pageMovies: page, type: 'movies' })
            .then((response) => {
                if (!reset) {
                    const currentMovies = moviesFetch.data?.results?.movies ?? [];
                    response.results.movies = [...currentMovies, ...response.results.movies]
                }
                moviesFetch.setData(response)
            })
            .catch(moviesFetch.setError)
    }

    const fetchSeries = (page: number, reset: boolean) => {
        // Fetch series
        searchMovies({ ...getSearchPayload(), pageSeries: page, type: 'series' })
            .then((response) => {
                if (!reset) {
                    const currentSeries = seriesFetch.data?.results?.series ?? [];
                    response.results.series = [...currentSeries, ...response.results.series]
                }
                seriesFetch.setData(response)
            })
            .catch(seriesFetch.setError)
    }

    const displaySearchingText = () => {
        if (tab === 'movies') {
            if (!moviesFetch.data) return 'Searching...'
            return `${moviesFetch.data.totalMovies} results, ${moviesFetch.data.time}ms`
        }

        if (!seriesFetch.data) return 'Searching...'
        return `${seriesFetch.data.totalSeries} results, ${seriesFetch.data.time}ms`
    }

    let movies: Movie[] = [];
    if (moviesFetch.data && moviesFetch.data.results) {
        if (moviesFetch.data.results.movies) {
            movies = moviesFetch.data.results.movies
        }
    }
    let series: Serie[] = [];
    if (seriesFetch.data && seriesFetch.data.results) {
        if (seriesFetch.data.results.series) {
            series = seriesFetch.data.results.series
        }
    }

    return (
        <Panel className="mb-6">
            <h1 className="ml-4">
                <MovieTVShowSwitch type={tab} onSwitch={setTab} />
            </h1>
            <span style={{ color: 'gray', fontSize: 15, marginLeft: '1.2em' }}>
                {displaySearchingText()}
            </span>
            <Grid fluid >
                {moviesFetch.isLoading
                    ? <LoaderRowCenter />
                    : <InfiniteScroll
                        key={tab}
                        loadMore={(page) => {
                            if (tab === 'movies') fetchMovies(page + 1, false)
                            else fetchSeries(page + 1, false)
                        }}
                        hasMore={true}
                        loader={<Loader size="lg" />}
                    >
                        <Row>
                            {(tab === 'movies' ? movies : series).map((item) => (
                                <Col key={item.id} xs={24} sm={12} md={6} lg={4} >
                                    <MovieCard movie={item} type={tab} />
                                </Col>
                            ))}
                        </Row>
                    </InfiniteScroll>
                }
            </Grid>
        </Panel>
    );
}
