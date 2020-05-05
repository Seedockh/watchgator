import React, { FunctionComponent, CSSProperties, useEffect } from 'react'
import { Grid, Row, Col, InputGroup, Input, Icon } from 'rsuite'
import { useInputTimeout } from '../hooks/useInputTimeout'

type SearchbarProps = {
    style?: CSSProperties
    onChange: (query: string) => void
}

export const Searchbar: FunctionComponent<SearchbarProps> = ({ style, onChange }) => {
    const searchInput = useInputTimeout()

    useEffect(() => {
        onChange(searchInput.timeoutValue)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchInput.timeoutValue])

    return <Grid fluid style={style}>
        <Row>
            <Col xs={24} md={12} mdOffset={6}>
                <InputGroup inside size="lg" style={{ width: '100%' }}>
                    <Input placeholder="Search a movie title, actor, realtor, ..." {...searchInput.bind} />
                    <InputGroup.Button>
                        <Icon icon="search" size="lg" />
                    </InputGroup.Button>
                </InputGroup>
            </Col>
        </Row>
    </Grid>

}
