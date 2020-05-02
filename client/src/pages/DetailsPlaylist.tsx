import React, { useEffect } from 'react'
import { Container, Content, Panel, Divider, Badge, FlexboxGrid, Button } from 'rsuite'
import Coverflow from 'react-coverflow'
import { useHistory } from 'react-router-dom'

import User from '../core/user'
import { Sidebar } from '../widget/sidebar/Sidebar'
import { playlists } from '../data/playlists'

const DetailsPlaylists = () => {
    const [{ user }, dispatch] = User.GlobalState()
    const history = useHistory();

    useEffect(() => {
        console.log(`user: ${JSON.stringify(user)}`)
    }, [user])

    return (
        <div className="sidebar-page">
            <Container>
                <Sidebar items={[
                    {
                        title: 'Playlists',
                        icon: 'list-ul',
                    }
                ]} />
                <Content style={{ marginRight: 100 }}>
                    <Panel>
                        <Content>
                            <h3>{playlists[0].name} <Badge content={playlists[0].movies.length} style={{ backgroundColor: "green", fontSize: 15 }} /></h3>
                            <Divider />
                            {playlists[0].movies.map(movie => (
                                <Panel bordered bodyFill style={{ marginBottom: 20 }}>
                                    <FlexboxGrid>
                                        <FlexboxGrid.Item colspan={4}>
                                            <img src={movie.imageUrl} style={{ width: 200, height: 250 }}></img>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item style={{ width: "80%" }}>
                                            <h3 style={{ marginBottom: 10 }}>{movie.name}</h3>
                                            <h5>Description</h5>
                                            <Divider />
                                            <p style={{marginBottom: 30}}>{movie.description}</p>
                                            <div style={{display: "flex", justifyContent: "center"}}>
                                            <Button onClick={() => history.push(`/movie/${movie.id}`)}>View more</Button>
                                            </div>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </Panel>
                            )
                            )}
                        </Content>
                    </Panel>
                </Content>
            </Container>
        </div>
    )
}
export default DetailsPlaylists;