import React, { useEffect } from 'react'
import { Container, Content, Grid, Panel, Row, Divider } from 'rsuite'

import User from '../core/user'
import MyPlaylist from '../widget/MyPlaylist'
import { Sidebar } from '../widget/sidebar/Sidebar'

const Profile = () => {
  const [{ user }] = User.GlobalState()

  useEffect(() => {
    console.log(`user: ${JSON.stringify(user)}`)
  }, [user])

  return (
    <div className="sidebar-page">
      <Container>
        <Sidebar items={[
          {
            title: 'Update information',
            icon: 'edit',
          }
        ]} />
        <Content style={{ marginRight: 100 }}>
          <Panel>
            <MyPlaylist />
            <h3>My Favorites</h3>
            <Divider />
            <Grid fluid>
              <Row className="show-grid" gutter={30}>
                {/* {moviesList.map((movie) => (
                    <Col xs={24} sm={12} md={6} lg={4} style={{ width: 240 }} >
                      <MovieCard movie={movie} />
                    </Col>
                  )
                )} */}
              </Row>
            </Grid>
          </Panel>
        </Content>
      </Container>
    </div>
  )
}
export default Profile;