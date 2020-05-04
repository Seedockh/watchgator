import React, { useEffect } from 'react'
import { Container, Content, Grid, Row, Col, Panel, Header, Loader } from 'rsuite'
import { MovieCard } from '../widget/MovieCard'
import { Searchbar } from '../widget/Searchbar'
import { MovieFilter } from '../models/MovieFilter'
import { Movie } from '../models/api/Movie'
import { useApiFetch } from '../hooks/api/useApiFetch'
import { MovieResponse } from '../models/api/MoviesResponse'
import { searchMovies } from '../core/api/Api'
import { FiltersSidebar } from '../widget/sidebar/FiltersSidebar'

export const Home = () => {
  const moviesFetch = useApiFetch<MovieResponse>()

  useEffect(() => { onFiltersChange() }, [])

  const onFiltersChange = (filters?: MovieFilter) => {
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
      .then((res) => {
        console.log(res);
        
        moviesFetch.setData(res)
      })
      .catch(moviesFetch.setError)
  }

  let movies: Movie[] = [];
  if (moviesFetch.data && moviesFetch.data.results && moviesFetch.data.results.movies) {
    movies = moviesFetch.data.results.movies
  }

  return (
    <Container>
      <FiltersSidebar onApplyFilters={onFiltersChange} />

      <Container>
        <Header className='p-4'>
          <Searchbar />
        </Header>
        <Content>
          <Panel className="mb-6">
            <h1 className="ml-4">Movies</h1>
            {moviesFetch.isLoading
              ? <Loader />
              : <Grid fluid >
                <Row>
                  {movies.map((movie) => (
                    <Col key={movie.id} xs={24} sm={12} md={6} lg={4} >
                      <MovieCard movie={movie} />
                    </Col>
                  ))}
                </Row>
              </Grid>
            }
          </Panel>
        </Content>
      </Container>
    </Container>
  );
}
