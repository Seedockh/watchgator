import React, { useState, useEffect, CSSProperties } from 'react'
import { Container, Content, Grid, Row, Col, Panel, Header, Loader } from 'rsuite'

//import InfiniteScroll from 'react-infinite-scroller';
import { MovieCard } from '../widget/MovieCard'
import { Sidebar } from '../widget/sidebar/Sidebar'
import { Searchbar } from '../widget/Searchbar'
import { FiltersDialog } from '../widget/filters/FiltersDialog'
import { FilterButton } from '../widget/filters/FilterButton'
import { MovieFilter } from '../models/MovieFilter'
import { useSearchMovies } from '../hooks/api/useApi'
import { Movie } from '../models/api/Movie'
import { UserGlobalState } from '../core/user'


export const Home = () => {
  const [isFiltersOpen, setFiltersOpen] = useState(false)
  //const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<MovieFilter>()
  const { data, isLoading, search } = useSearchMovies()
  const [{ user }] = UserGlobalState()

  useEffect(() => {
    search(filters ? {
      names: {
        actors: filters.actors,
        genres: filters.categories.map((c) => ({ name: c }))
      },
      filters: {
        year: filters.years,
        rating: filters.rating
      }/*,
      pageMovies: currentPage*/
    } : {})
  }, [filters]) // currentPage

  const loaderStyle = {
    width: '100',
    marginLeft: '40%',
    marginTop: '10em'
  }

  const close = () => {
    setFiltersOpen(false)
  }
  const open = () => {
    setFiltersOpen(true)
  }

  let movies: Movie[] = [];
  if (data && data.results && data.results.movies) {
    movies = data.results.movies
  }

  return (
    <Container>
      <Sidebar items={[
        {
          title: 'Categories',
          icon: 'bookmark',
          items: [
            {
              title: 'Action',
              path: '/categories/action'
            },
            {
              title: 'Science-fiction',
              path: '/categories/science-fiction'
            },
            {
              title: 'Policier',
              path: '/categories/policier'
            },
            {
              title: 'Animé',
              path: '/categories/anime'
            }
          ]

        },
        {
          title: 'Decade',
          icon: 'calendar',
          items: [
            {
              title: '80\'s',
              path: '/decade/1980'
            },
            {
              title: '90\'s',
              path: '/decade/1990'
            },
            {
              title: '2000\'s',
              path: '/decade/2000'
            },
            {
              title: '2010\'s',
              path: '/decade/2010'
            },
          ]

        },
      ]} userConnected={user} />

      <Container>
        <Header className='p-4'>
          <Searchbar />
        </Header>
        <Content>
          <Panel className="mb-6">
            <h1 className="ml-4">Movies</h1>
            {isLoading
              ? <Grid fluid >
                <Row style={loaderStyle}>
                  <Loader size="lg"/>
                </Row>
              </Grid>
              :
                <Grid fluid >
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

      <FilterButton onClick={open} />
      <FiltersDialog isOpen={isFiltersOpen} onClose={close} onApplyFilters={setFilters} initFilters={filters ? { ...filters } : undefined} />
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
