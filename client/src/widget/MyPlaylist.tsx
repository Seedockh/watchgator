import React, { useState } from 'react'
import {
    Container, Content, Divider, FlexboxGrid, Icon,
    Button, Modal, Form, FormControl, FormGroup, ControlLabel, Panel, Row, Col, Toggle
} from 'rsuite'
import { moviesList } from '../data/movies';

const MyPlaylist = () => {
    const [show, setShow] = useState(false);

    const openModal = () => {
        setShow(true)
    }

    const closeModal = () => {
        setShow(false)
    }

    const playlists = [
        {
            "name": "Aventure",
            "films": [
                moviesList[1],
                moviesList[2],
                moviesList[3],
                moviesList[4],
                moviesList[6],
            ]
        },
        {
            "name": "Romance",
            "films": [
                moviesList[1],
            ]
        },
        {
            "name": "Action",
            "films": [
                moviesList[11],
                moviesList[13],
            ]
        },
        {
            "name": "Comedie",
            "films": [
                moviesList[3],
                moviesList[4],
                moviesList[11],
                moviesList[13],
            ]
        },
    ]

    return (
        <Container>
            <Content>
                <FlexboxGrid justify="space-between">
                    <FlexboxGrid.Item>
                        <h3>My Playlists</h3>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item style={{ marginRight: 100 }}>
                        <Button icon="plus" onClick={openModal}>
                            <Icon icon="plus" style={{ color: "green" }} />
                        </Button>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
                <Divider />
                {/*TODO: For each playlist */}
                <Row className="show-grid" gutter={30}>
                    {playlists.map((item) =>
                        (<Col xs={4} style={{ marginBottom: 20 }}>
                            <Panel style={{ height: 200, padding: 0 }} bodyFill header={`${item.name}  -     films :   ${item.films.length}`} bordered>
                                <img src={item.films[0].imageUrl} style={{ width: "100%", height: "100%" }} />
                            </Panel>
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