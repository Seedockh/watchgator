import React, { useEffect, useContext } from 'react'
import { Container, Content, Grid, Panel, Row, Divider, Col } from 'rsuite'

import { UserGlobalState } from '../core/user'
import MyPlaylist from '../widget/MyPlaylist'
import { Sidebar } from '../widget/sidebar/Sidebar'
import { MovieCard } from '../widget/MovieCard'

const Profile = () => {
  const [{user}, dispatch] = UserGlobalState()

  return (
    <div className="sidebar-page">
      <Container>
        <Sidebar items={[
          {
            title: 'Update information',
            icon: 'edit',
          }
        ]} userConnected={user} />
        <Content style={{ marginRight: 100 }}>
          <Panel>
            <MyPlaylist />
            <h3>My Favorites</h3>
            <Divider />
            <Grid fluid>
              <Row className="show-grid" gutter={30}>
                {user?.movies?.length ?? 0 > 0 ?
                  user?.movies.map((itemMovie) => (
                    <Col xs={24} sm={12} md={6} lg={4} style={{ width: 240 }} >
                      <MovieCard movie={itemMovie} />
                    </Col>
                  ))
                  : <h3> Sorry you don't have Favorites Movies</h3>
                }
              </Row>
            </Grid>
          </Panel>
        </Content>
      </Container>
    </div>
  )
}
export default Profile;