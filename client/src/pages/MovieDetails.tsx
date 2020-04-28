import React, { FunctionComponent, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Container, Icon, Content, Grid, Row, Col, Panel, Nav } from 'rsuite'
import { TagList } from '../widget/TagList'
import { RatingStars } from '../widget/RatingStars'
import { Searchbar } from '../widget/Searchbar'

type MovieDetailsProps = {
    movieId: number;
}

export const MovieDetails: FunctionComponent<MovieDetailsProps> = (props) => {
    const [activeTab, setActiveTab] = useState("overview")
    const history = useHistory()

    const renderTabs = (): JSX.Element => {
        if (activeTab === 'overview') {
            return <p>Here the synopsis of the movie</p>
        }
        if (activeTab === 'trailer') {
            return <iframe width="560" height="315" src="https://www.youtube.com/embed/2ekI3AvmqOk" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>
        }
        if (activeTab === 'details') {
            return <p>Here details of the movie</p>
        }
        return <></>
    }

    return (
        <Container>
            <Content style={{ padding: 32}}>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <Icon icon="close" size="3x" onClick={() => history.goBack()} style={{ marginRight: 16 }} />
                    <Searchbar style={{ flex: 1 }} />
                </div>
                <Grid fluid style={{marginTop: 64}}>
                    <Row>
                        <Col xs={24} sm={12} md={6} lg={4}>
                            <img src="https://i.pinimg.com/originals/cf/cc/b5/cfccb5ac3a79681cbddae604c8372682.jpg" style={{ width: '100%', borderRadius: 8 }} />
                        </Col>
                        <Col xs={24} sm={12} md={18} lg={20} style={{paddingLeft: 32}}>
                            <h1>Avengers: Endgame</h1>
                            <TagList tags={["Action", "Drama", "Science-fiction"]} />

                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 24 }}>
                                <div style={{ textAlign: 'center' }}>
                                    <h4>5.5</h4>
                                    <RatingStars rating={5.5} />
                                </div>
                                <div style={{ flex: 1, marginLeft: 64 }}>
                                    <h4 style={{ textAlign: 'start', verticalAlign: 'middle' }}>120 minutes</h4>
                                </div>
                            </div>
                            <Nav appearance="subtle" activeKey={activeTab} onSelect={setActiveTab} style={{marginTop: 32}}>
                                <Nav.Item eventKey="overview"><h5>Overview</h5></Nav.Item>
                                <Nav.Item eventKey="trailer"><h5>Trailer</h5></Nav.Item>
                                <Nav.Item eventKey="details"><h5>Details</h5></Nav.Item>
                            </Nav>
                            <Panel>
                                {renderTabs()}
                            </Panel>
                        </Col>
                    </Row>
                </Grid>
            </Content>
        </Container>
    );
}
