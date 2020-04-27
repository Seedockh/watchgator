import React, { useEffect, useState } from 'react'
import User from '../core/user'
import { useHistory } from 'react-router-dom'
import { Container, Icon, Content, InputGroup, Input, Grid, Row, Col, Panel } from 'rsuite'
import { MovieCard } from '../widget/MovieCard'
import { moviesHomeList } from '../data/movies'
import { Sidebar } from '../widget/sidebar/Sidebar'

export const Home = () => {
  const [{ user }] = User.GlobalState()
  const [expand, setExpand] = useState(true)
  const history = useHistory()

  useEffect(() => {
    console.log('Home page called !')

    if (!user) history.push('/')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // const logout = (): void => {
  //   dispatch({ type: 'setUser', payload: null })
  //   history.push('/')
  // }

  const handleToggle = () => {
    setExpand(!expand);
  }

  return (
    <div className="sidebar-page">
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

        <Content>
          <Panel>
            <Grid fluid>
              <Row>
                <Col xs={24} md={12} mdOffset={6}>
                  <InputGroup inside size="lg" style={{ width: '100%' }}>
                    <Input />
                    <InputGroup.Button>
                      <Icon icon="search" size="lg" />
                    </InputGroup.Button>
                  </InputGroup>
                </Col>
              </Row>
            </Grid>

            <h1 style={{ marginTop: 32 }}>Movies</h1>

            <Grid fluid>
              <Row className="show-grid">
                {moviesHomeList.map((movie) => (
                  <Col xs={24} sm={12} md={6} lg={4} >
                    <MovieCard movie={movie} />
                  </Col>
                ))}
              </Row>
            </Grid>

          </Panel>
        </Content>
      </Container>
    </div>
  );
}
