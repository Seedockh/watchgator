import React, { useEffect } from 'react'
import { Container, Content, Panel, Divider, Badge } from 'rsuite'
import Coverflow from 'react-coverflow'
import { useHistory } from 'react-router-dom'

import User from '../core/user'
import { Sidebar } from '../widget/sidebar/Sidebar'
import { playlists } from '../data/playlists'

const Playlists = () => {
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
                        {playlists.map(playlist => (
                            <Content>
                                <h3>{playlist.name} <Badge content={playlist.movies.length} style={{ backgroundColor: "green", fontSize: 15 }} /></h3>
                                <Divider />
                                <Coverflow
                                    displayQuantityOfSide={3}
                                    navigation={false}
                                    enableHeading={false}
                                    enableScroll={false}
                                >
                                    {playlist.movies.map(movie => (
                                        <img src={movie.imageUrl} alt='title or description' onClick={() => history.push(`/movie/${movie.id}`)} />
                                    ))}
                                </Coverflow>
                            </Content>
                        )
                        )}
                    </Panel>
                </Content>
            </Container>
        </div>
    )
}
export default Playlists;