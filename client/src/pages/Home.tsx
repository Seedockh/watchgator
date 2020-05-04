import React, { useEffect, CSSProperties, useState } from 'react'
import { Container, Content, Grid, Row, Col, Panel, Header, Loader } from 'rsuite'
//import InfiniteScroll from 'react-infinite-scroller';
import { MovieCard } from '../widget/MovieCard'
import { Searchbar } from '../widget/Searchbar'
import { MovieFilter } from '../models/MovieFilter'
import { Movie } from '../models/api/Movie'
import { useApiFetch } from '../hooks/api/useApiFetch'
import { MovieResponse } from '../models/api/MoviesResponse'
import { searchMovies } from '../core/api/Api'
import { FiltersSidebar } from '../widget/sidebar/FiltersSidebar'
import { Serie } from '../models/api/Serie'

const loaderStyle: CSSProperties = {
  width: 100,
  marginLeft: '40%',
  marginTop: '10em'
}

type TabType = 'movies' | 'tvshows'

export const Home = () => {
  const [tab, setTab] = useState<TabType>('movies')
  //const [currentPage, setCurrentPage] = useState(1)
  const moviesFetch = useApiFetch<MovieResponse>()

  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const displayTabTitles = () => {
    if (tab === 'movies') {
      return <span>Movies <small>/</small> <small onClick={() => setTab('tvshows')}>TV Shows</small></span>
    }
    return <span><small onClick={() => setTab('movies')}>Movies</small> <small>/</small> TV Shows</span>
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
            <h1 className="ml-4">{displayTabTitles()}</h1>
            <Grid fluid >
              {moviesFetch.isLoading
                ? <Row style={loaderStyle}>
                  <Loader size="lg" />
                </Row>
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
        </Content>
      </Container>
    </Container>
  );
}

/*<InfiniteScroll
    pageStart={currentPage}
    loadMore={() => setCurrentPage(currentPage + 1)}
    hasMore={data ? (currentPage <= data.moviesPages) : false}
    loader={<Loader size="lg"/>}
  >
</InfiniteScroll>*/
