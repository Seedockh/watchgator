import React from 'react'
import { useHistory } from 'react-router-dom'
import { Container, Content, Grid, Panel, Row, Divider, Col } from 'rsuite'

import { UserGlobalState } from '../core/user'
import MyPlaylist from '../widget/MyPlaylist'
import { Sidebar } from '../widget/sidebar/Sidebar'
import { MovieCard } from '../widget/MovieCard'

const Profile = () => {
  const [{ user }] = UserGlobalState()
  const history = useHistory()

  if (!user) {
    history.push("/")
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
                {user?.movies?.length ?? 0 ?
                  user?.movies.map((itemMovie) => (
                    <Col xs={24} sm={12} md={6} lg={4} style={{ width: 240 }} >
                      <MovieCard movie={itemMovie} />
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
export default Profile;