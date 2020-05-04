import React, { useEffect } from 'react'
import { Container, Content, Panel, Divider, Badge, FlexboxGrid, Button } from 'rsuite'
import { useHistory } from 'react-router-dom'

import User from '../core/user'
import { Sidebar } from '../widget/sidebar/Sidebar'
import { playlists } from '../data/playlists'

export const DetailsPlaylists = () => {
    const [{ user }] = User.GlobalState()
    const history = useHistory();

    useEffect(() => {
        console.log(`user: ${JSON.stringify(user)}`)
    }, [user])

    return (
        <Container>
            <Sidebar items={[
                {
                    title: 'Playlists',
                    icon: 'list-ul',
                }
            ]} />
            <Content className="mr-5">
                <Panel>
                    <Content>
                        <h3>{playlists[0].name} <Badge content={playlists[0].movies.length} style={{ backgroundColor: "green", fontSize: 15 }} /></h3>
                        <Divider />
                        {playlists[0].movies.map(movie => (
                            <Panel bordered bodyFill className="mb-5">
                                <FlexboxGrid>
                                    <FlexboxGrid.Item colspan={4}>
                                        <img src={movie.imageUrl} alt={movie.name} style={{ width: 200, height: 250 }}></img>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item style={{ width: "80%" }}>
                                        <h3 className="mb-3">{movie.name}</h3>
                                        <h5>Description</h5>
                                        <Divider />
                                        <p className="mb-6" >{movie.description}</p>
                                        <div className="flex flex-content-center">
                                            <Button onClick={() => history.push(`/movies/${movie.id}`)}>View more</Button>
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
    )
}