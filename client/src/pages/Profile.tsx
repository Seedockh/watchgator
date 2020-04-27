import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Container, Content, Grid, Panel, Col, Row, Divider } from 'rsuite'
import useInput from '../core/useInput'
import User from '../core/user'
import MyPlaylist from '../components/MyPlaylist'
import { films } from '../data/films'
import { Sidebar } from '../widget/sidebar/Sidebar'
import { MovieCard } from '../widget/MovieCard'

const Profile = () => {
  const [{ user }, dispatch] = User.GlobalState()
  const history = useHistory()

  useEffect(() => {
    // do something once here
    console.log('Login page called !')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    console.log(`user: ${JSON.stringify(user)}`)
  }, [user])

  //const listFilms = films
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
                {films.map((item) =>
                  (
                    
                    <Col xs={24} sm={12} md={6} lg={4} style={{width: 240}} >
                     <MovieCard movie={item} />
                  </Col>
                    // <Col xs={4} style={{ marginBottom: 20 }}>
                    //   <MovieCard movie={item} />
                    //   {/* <Panel shaded bordered bodyFill style={{ display: 'inline-block', width: 240, height: 400 }}>
                    //     <img src={item.posterUrl} style={{ width: "100%", height: "50%" }} />
                    //     <Content>
                    //       <h5 style={{ padding: 5, textAlign: "center" }}>{item.title}</h5>
                    //     </Content>
                    //   </Panel> */}
                    // </Col>
                  )
                )}
              </Row>
            </Grid>
          </Panel>
        </Content>
      </Container>
    </div>
  )
}
export default Profile;