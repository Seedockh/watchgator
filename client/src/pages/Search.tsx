import React, { useEffect, useState, FunctionComponent } from 'react'
import { Grid, Row, Col, Panel, Loader } from 'rsuite'
import { MovieCard } from '../widget/MovieCard'
import { Movie } from '../models/api/Movie'
import { useApiFetch } from '../hooks/api/useApiFetch'
import { findMovies, findSeries } from '../core/api/Api'
import { MovieTVShowSwitch, SwitchValue } from '../widget/MovieTVShowSwitch'
import { BaseResponse } from '../models/api/BaseResponse'
import { Serie } from '../models/api/Serie'

type SearchProps = {
  query: string;
}

export const Search: FunctionComponent<SearchProps> = ({ query }) => {
  const [tab, setTab] = useState<SwitchValue>('movies')
  const moviesFetch = useApiFetch<BaseResponse<Movie[][]>>()
  const seriesFetch = useApiFetch<BaseResponse<Serie[][]>>()

  useEffect(() => {
    moviesFetch.setLoading(true)
    findMovies(query)
    .then(moviesFetch.setData)
    .catch(moviesFetch.setError)
    seriesFetch.setLoading(true)
    findSeries(query)
      .then(seriesFetch.setData)
      .catch(seriesFetch.setError)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  let movies: Movie[] = [];
  if (moviesFetch.data && moviesFetch.data.results && moviesFetch.data.results[0]) {
    movies = moviesFetch.data.results[0]
  }

  let series: Movie[] = [];
  if (seriesFetch.data && seriesFetch.data.results && seriesFetch.data.results[0]) {
    series = seriesFetch.data.results[0]
  }

  return <Panel className="mb-6">
    <h1>Search results</h1>
    <h3 className="ml-4">
      <MovieTVShowSwitch type={tab} onSwitch={setTab} />
    </h3>
    <Grid fluid >
      {moviesFetch.isLoading || seriesFetch.isLoading
        ? <Loader size="lg" />
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
}