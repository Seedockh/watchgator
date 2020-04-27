import React, { useEffect, useState, CSSProperties } from 'react'
import User from '../core/user'
import { useHistory } from 'react-router-dom'
import { Container, Sidebar, Sidenav, Icon, Nav, Dropdown, Content, InputGroup, Input, Grid, Row, Col, Panel, FlexboxGrid } from 'rsuite'
import { NavToggle } from '../widget/NavToggle'
import { MovieCard } from '../widget/MovieCard'
import { moviesHomeList } from '../data/movies'

const headerStyles: CSSProperties = {
  padding: 18,
  fontSize: 16,
  height: 56,
  background: '#34c3ff',
  color: ' #fff',
  whiteSpace: 'nowrap',
  overflow: 'hidden'
};

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
    <div className="show-fake-browser sidebar-page">
      <Container>
        <Sidebar
          style={{ display: 'flex', flexDirection: 'column' }}
          width={expand ? 260 : 56}
          collapsible
        >
          <Sidenav.Header>
            <div style={headerStyles}>
              <Icon icon="logo-analytics" size="lg" style={{ verticalAlign: 0 }} />
              <span style={{ marginLeft: 12 }}> WatchGator</span>
            </div>
          </Sidenav.Header>
          <Sidenav
            expanded={expand}
            defaultOpenKeys={['3']}
            appearance="subtle"
          >
            <Sidenav.Body>
              <Nav>
                <Nav.Item eventKey="1" active icon={<Icon icon="dashboard" />}>
                  Dashboard
                  </Nav.Item>
                <Nav.Item eventKey="2" icon={<Icon icon="group" />}>
                  User Group
                  </Nav.Item>
                <Dropdown
                  eventKey="3"
                  trigger="hover"
                  title="Advanced"
                  icon={<Icon icon="magic" />}
                  placement="rightStart"
                >
                  <Dropdown.Item eventKey="3-1">Geo</Dropdown.Item>
                  <Dropdown.Item eventKey="3-2">Devices</Dropdown.Item>
                  <Dropdown.Item eventKey="3-3">Brand</Dropdown.Item>
                  <Dropdown.Item eventKey="3-4">Loyalty</Dropdown.Item>
                  <Dropdown.Item eventKey="3-5">Visit Depth</Dropdown.Item>
                </Dropdown>
                <Dropdown
                  eventKey="4"
                  trigger="hover"
                  title="Settings"
                  icon={<Icon icon="gear-circle" />}
                  placement="rightStart"
                >
                  <Dropdown.Item eventKey="4-1">Applications</Dropdown.Item>
                  <Dropdown.Item eventKey="4-2">Websites</Dropdown.Item>
                  <Dropdown.Item eventKey="4-3">Channels</Dropdown.Item>
                  <Dropdown.Item eventKey="4-4">Tags</Dropdown.Item>
                  <Dropdown.Item eventKey="4-5">Versions</Dropdown.Item>
                </Dropdown>
              </Nav>
            </Sidenav.Body>
          </Sidenav>
          <NavToggle expand={expand} onChange={handleToggle} />
        </Sidebar>

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
