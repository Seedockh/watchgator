import React from 'react'
import { Container, Content, Panel, Divider, Badge } from 'rsuite'
import Coverflow from 'react-coverflow'
import { useHistory } from 'react-router-dom'

import { UserGlobalState } from '../core/user'
import { Sidebar } from '../widget/sidebar/Sidebar'
import { addPictureUrlSize } from '../utils/movieUtils'

export const Playlists = () => {
    const [{ user }] = UserGlobalState()
    const history = useHistory();

    if(!user) {
        history.push('/')
    }
    
    return (
        <Container>
            <Sidebar items={[{
                title: 'Home',
                icon: 'home',
                path: "/"
            },]} userConnected={user} />
            <Content className="mr-6">
                <Panel>
                    {user?.playlists?.length ?? 0  ?
                        user?.playlists?.map((playlist) => (
                            <Content>
                                <h3>{playlist.name} <Badge content={playlist.movies.length} style={{ backgroundColor: "green", fontSize: 15 }} /></h3>
                                <Divider />
                                <Coverflow
                                    displayQuantityOfSide={3}
                                    navigation={true}
                                    enableHeading={false}
                                    enableScroll={false}
                                >
                                    {playlist.movies.map(movie => (
                                        <img src={addPictureUrlSize(movie.picture, 700)} alt={movie.title} onClick={() => history.push(`/movies/${movie.id}`)} />
                                    ))}
                                </Coverflow>
                            </Content>
                        ))
                        :
                        <div className='flex flex-content-center'>
                            <h3> Sorry you don't have Playlists</h3>
                        </div>
                    }
                </Panel>
            </Content>
        </Container>
    )
}