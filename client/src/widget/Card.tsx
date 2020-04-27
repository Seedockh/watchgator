import React, { FunctionComponent, CSSProperties } from 'react'
import { Container } from 'rsuite'

const cardStyle: CSSProperties = {
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#303030'
}

type CardProps = {
    bgImage?: string
}

export const Card: FunctionComponent<CardProps> = ({ children, bgImage }) => {
    return (
        <Container style={cardStyle}>
            {bgImage && <img src={bgImage} />}
            {children}
        </Container>
    )
}
