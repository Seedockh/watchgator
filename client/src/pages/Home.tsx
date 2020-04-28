import React from 'react'
import { Container, Content, Grid, Row, Col, Panel, Header } from 'rsuite'
import { MovieCard } from '../widget/MovieCard'
import { moviesList } from '../data/movies'
import { Sidebar } from '../widget/sidebar/Sidebar'
import { Searchbar } from '../widget/Searchbar'

export const Home = () => {

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

        }
      ]} />

      <Container>
        <Header style={{ padding: 16 }}>
          <Searchbar />
        </Header>
        <Content>
          <Panel style={{ marginTop: 32 }}>
            <h1 style={{ marginLeft: 16 }}>Movies</h1>
            <Grid fluid >
              <Row>
                {moviesList.map((movie) => (
                  <Col xs={24} sm={12} md={6} lg={4} >
                    <MovieCard movie={movie} />
                  </Col>
                ))}
              </Row>
            </Grid>
          </Panel>
        </Content>
      </Container>
    </Container>
  );
}
