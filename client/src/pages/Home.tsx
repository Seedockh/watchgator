import React, { useState } from 'react'
import { Container, Content, Header } from 'rsuite'
import { Searchbar } from '../widget/Searchbar'
import { MovieFilter } from '../models/MovieFilter'
import { FiltersSidebar } from '../widget/sidebar/FiltersSidebar'
import { HomeMovies } from './HomeMovies'
import { Search } from './Search'
import { Sidebar } from '../widget/sidebar/Sidebar'
import { UserGlobalState } from '../core/user'

export const Home = () => {
  const [filters, setFilters] = useState<MovieFilter>()
  const [search, setSearch] = useState<string>()
  const [{ user }] = UserGlobalState()

  return (
    <Container>
      {search
        ? <Sidebar items={[]} userConnected={user} />
        : <FiltersSidebar onApplyFilters={setFilters} userConnected={user} />
      }
      <Container>
        <Header className='p-4'>
          <Searchbar onChange={setSearch} />
        </Header>
        <Content>
          {search && search.trim().length > 0
            ? <Search query={search} />
            : <HomeMovies filters={filters} />
          }
        </Content>
      </Container>
    </Container>
  );
}
