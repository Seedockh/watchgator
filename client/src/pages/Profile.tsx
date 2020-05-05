import React, { useState, useEffect} from 'react'
import { useHistory } from 'react-router-dom'
import { Container, Content, Grid, Panel, Row, Divider, Col } from 'rsuite'

import { UserGlobalState } from '../core/user'
import MyPlaylist from '../widget/MyPlaylist'
import { Sidebar } from '../widget/sidebar/Sidebar'
import { MovieCard } from '../widget/MovieCard'
import { Movie } from '../models/api/Movie'

export const Profile = () => {
  const [{ user }] = UserGlobalState()
  const history = useHistory()
  const movies: Movie[] = []

  if (!user) {
    history.push("/")
  }

  useEffect(() => {
    if(user!.movies?.length > 0) {
      
      user?.movies.forEach(item => {
        fetchMovie(item.movie!)
      })
    }
  }, [history])

  const fetchMovie = async (id: string) => {
      const res = await fetch(`${process.env.REACT_APP_API_URI}/movies/${id}`);

      res.json().then(res => {
        movies.push(res)

      }).catch(error => console.log(error));
  }

  return (
    <div className="sidebar-page">
      <Container>
        <Sidebar items={[
          {
            title: 'Update information',
            icon: 'edit',
            path: '/information'
          },
          {
            title: 'Home',
            icon: 'home',
            path: "/"
          },
        ]} userConnected={user} />
        <Content style={{ marginRight: 100 }}>
          <Panel>
            <h3>My Favorites</h3>
            <Divider />
            <Grid fluid className="mb-6">
              <Row className="show-grid" gutter={30}>
                {/* {movies.map(test => console.log(test))} */}
                {movies?.length ?? 0 ?
                  movies?.map((itemMovie) => (
                    <Col xs={24} sm={12} md={6} lg={4} style={{ width: 240 }} >
                      <MovieCard movie={itemMovie} type='movies'/>
                    </Col>
                  ))
                  : <h3> Sorry you don't have Favorites Movies</h3>
                }
              </Row>
            </Grid>
            <MyPlaylist />
          </Panel>
        </Content>
      </Container>
    </div>
  )
}
