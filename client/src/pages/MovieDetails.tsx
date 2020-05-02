import React, { FunctionComponent, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Container, Icon, Content, Grid, Row, Col, Panel, Nav, Button, Avatar, Rate } from 'rsuite'
import { TagList } from '../widget/TagList'
import { Searchbar } from '../widget/Searchbar'
import PlaceholderParagraph from 'rsuite/lib/Placeholder/PlaceholderParagraph'

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
            return <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/2ekI3AvmqOk"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                title='Movie trailer'
            />
        }
        if (activeTab === 'details') {
            return <p>Here details of the movie</p>
        }
        return <></>
    }

    return (
        <Container>
            <Content className='p-6'>
                <div className='flex'>
                    <Icon icon="close" size="3x" onClick={() => history.goBack()} style={{ marginRight: 16 }} />
                    <Searchbar style={{ flex: 1 }} />
                </div>
                <Grid fluid style={{ marginTop: 64 }}>
                    <Row>
                        <Col xs={24} md={6} lg={4} mdOffset={1} lgOffset={2} className='text-center'>
                            <Panel shaded bodyFill style={{ maxWidth: 300 }}>
                                <img src="https://i.pinimg.com/originals/cf/cc/b5/cfccb5ac3a79681cbddae604c8372682.jpg" style={{ width: '100%' }} alt='Movie poster' />
                            </Panel>
                        </Col>
                        <Col xs={24} md={15} lg={15} mdOffset={1}>
                            <h1>Avengers: Endgame</h1>
                            <TagList tags={["Action", "Drama", "Science-fiction"]} />

                            <div className='flex flex-align-center' style={{ marginTop: 24 }}>
                                <div className='text-center'>
                                    <h4>4.5/5</h4>
                                    <Rate readOnly={true} max={10} allowHalf={true} value={4.5} />
                                </div>
                                <div className='text-center' style={{ marginLeft: 64 }}>
                                    <Icon icon='clock-o' size='2x' />
                                    <h4 style={{ textAlign: 'start', verticalAlign: 'middle' }}>120 minutes</h4>
                                </div>
                            </div>
                            <Nav appearance="subtle" activeKey={activeTab} onSelect={setActiveTab} style={{ marginTop: 32 }}>
                                <Nav.Item eventKey="overview"><h5>Overview</h5></Nav.Item>
                                <Nav.Item eventKey="trailer"><h5>Trailer</h5></Nav.Item>
                                <Nav.Item eventKey="details"><h5>Details</h5></Nav.Item>
                            </Nav>
                            <Panel shaded>
                                {renderTabs()}
                            </Panel>
                            <div className='flex' style={{ marginTop: 16 }}>
                                <Button color='yellow' appearance='ghost'>
                                    <Icon icon='heart-o' /> Add to favorites
                                </Button>
                                <Button appearance='ghost' style={{ marginLeft: 16 }}>
                                    <Icon icon='list' /> Add to playlist
                                </Button>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: 32 }}>
                        <Col xs={24} md={22} lg={20} mdOffset={1} lgOffset={2}>
                            <h3 className='text-center'>Reviews</h3>
                            <Row>
                                {Array(10).fill(0).map((_) => (
                                    <Col xs={24} sm={12} md={8} lg={6}>
                                        <Panel shaded bordered header={
                                            <div className='flex flex-align-center'>
                                                <Avatar
                                                    circle
                                                    src="https://avatars2.githubusercontent.com/u/12592949?s=460&v=4"
                                                />
                                                <span style={{marginLeft: 12}}>Jean dupont</span>
                                            </div>
                                        } style={{ margin: 12 }}>
                                            <PlaceholderParagraph />
                                        </Panel>
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                    </Row>
                </Grid>
            </Content>
        </Container>
    );
}
