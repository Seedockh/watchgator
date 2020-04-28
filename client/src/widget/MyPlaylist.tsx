import React, { useState } from 'react'
import {
    Container, Content, Divider, FlexboxGrid, Icon,
    Button, Modal, Form, FormControl, FormGroup, ControlLabel, Panel, Row, Col, Toggle, Badge
} from 'rsuite'
import { useHistory } from 'react-router-dom';

import { playlists } from '../data/playlists';

const MyPlaylist = () => {
    const [show, setShow] = useState(false);
    const history = useHistory();

    const openModal = () => {
        setShow(true)
    }

    const closeModal = () => {
        setShow(false)
    }

    return (
        <Container>
            <Content>
                <FlexboxGrid justify="space-between">
                    <FlexboxGrid.Item>
                        <h3>My Playlists</h3>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item style={{ marginRight: 100 }}>
                        <Button onClick={openModal}>
                            <Icon icon="plus" style={{ color: "green" }} />
                        </Button>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
                <Divider />
                <Row className="show-grid" gutter={30}>
                    {playlists.map((playlist) =>
                        (<Col xs={8} style={{ marginBottom: 20 }}>
                            <div className="grow" onClick={() => history.push(`/playlist/${playlist.id}`)}>
                                <Panel style={{ height: 200, padding: 0 }} bodyFill bordered>
                                    <img src={playlist.movies[0].imageUrl} style={{ width: "100%", }} />
                                </Panel>
                                <h5 style={{ margin: 5 }}>{playlist.name} <Badge content={playlist.movies.length} style={{ backgroundColor: "green", fontSize: 15 }} />
                                </h5>
                            </div>
                        </Col>)
                    )}
                </Row>
                <div className="modal-container">
                    <Modal show={show} onHide={closeModal}>
                        <Modal.Header>
                            <Modal.Title>Create new playlist</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form layout="horizontal">
                                <FormGroup>
                                    <ControlLabel>Name : </ControlLabel>
                                    <FormControl checkAsync name="name" />
                                </FormGroup>
                                <FormGroup>
                                    <ControlLabel>Public : </ControlLabel>
                                    <Toggle />
                                </FormGroup>
                                <Modal.Footer>
                                    <Button appearance="primary" onClick={closeModal}>
                                        Create
                                    </Button>
                                </Modal.Footer>
                            </Form>
                        </Modal.Body>
                    </Modal>
                </div>
            </Content>
        </Container>
    )
}

export default MyPlaylist