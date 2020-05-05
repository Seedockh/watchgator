import React, { FunctionComponent, CSSProperties } from 'react'
import { Grid, Row, Col, InputGroup, Input, Icon } from 'rsuite'

type SearchbarProps = {
    style?: CSSProperties
    onChange: (query: string) => void
}

export const Searchbar: FunctionComponent<SearchbarProps> = ({ style, onChange }) => (
    <Grid fluid style={style}>
        <Row>
            <Col xs={24} md={12} mdOffset={6}>
                <InputGroup inside size="lg" style={{ width: '100%' }}>
                    <Input placeholder="Search a movie title, actor, realtor, ..." onChange={onChange} />
                    <InputGroup.Button>
                        <Icon icon="search" size="lg" />
                    </InputGroup.Button>
                </InputGroup>
            </Col>
        </Row>
    </Grid>
)
