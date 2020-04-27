import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Container, Content, ControlLabel, FlexboxGrid, Form, Panel, Col, Row, Button, Divider } from 'rsuite'
import useInput from '../core/useInput'
import User from '../core/user'
import MyPlaylist from '../components/MyPlaylist'
import films from '../data/films'

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

  const listFilms = films
  return (
    <FlexboxGrid>
      <FlexboxGrid.Item>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item style={{ width: "100%" }}>
        <Container style={{ marginTop: 50 }}>
          <Content>
            <MyPlaylist />
            <h3>My Favorites</h3>
            <Divider />
            <Row className="show-grid" gutter={30}>
              {listFilms.map((item) =>
                (
                  <Col xs={4} style={{ marginBottom: 20 }}>
                    <Panel shaded bordered bodyFill style={{ display: 'inline-block', width: 240, height: 400 }}>
                      <img src={item.posterUrl} style={{ width: "100%", height: "50%" }} />
                      <Content>
                        <h5 style={{padding: 5, textAlign: "center"}}>{item.title}</h5>
                      </Content>
                    </Panel>
                  </Col>
                )
              )}
            </Row>
          </Content>
        </Container>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  )
}
export default Profile;