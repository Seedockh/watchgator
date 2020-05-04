import React, { useState } from 'react'
import { Container, Content, Header } from 'rsuite'
import { Searchbar } from '../widget/Searchbar'
import { MovieFilter } from '../models/MovieFilter'
import { FiltersSidebar } from '../widget/sidebar/FiltersSidebar'
import { HomeMovies } from './HomeMovies'
import { Search } from './Search'
import { Sidebar } from '../widget/sidebar/Sidebar'

export const Home = () => {
  const [filters, setFilters] = useState<MovieFilter>()
  const [search, setSearch] = useState<string>()

  return (
    <Container>
      {search
        ? <Sidebar items={[]} />
        : <FiltersSidebar onApplyFilters={setFilters} />
      }
      <Container>
        <Header className='p-4'>
          <Searchbar onChange={setSearch} />
        </Header>
        <Content>
<<<<<<< HEAD
          {search && search.trim().length > 0
            ? <Search query={search} />
            : <HomeMovies filters={filters} />
          }
=======
          <Panel className="mb-6">
            <h1 className="ml-4">{displayTabTitles()}</h1>
            <span style={{ color: 'gray', fontSize: 15, marginLeft: '1.2em' }}>{moviesFetch.data ? `${moviesFetch.data.totalMovies} results, ${moviesFetch.data.time}ms` : 'searching...' }</span>
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
>>>>>>> add results and request time below Movies title
        </Content>
      </Container>
    </Container>
  );
}
