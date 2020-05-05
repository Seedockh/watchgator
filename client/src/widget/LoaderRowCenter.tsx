import React, { CSSProperties } from 'react'
import { Loader, Row } from 'rsuite'

const loaderStyle: CSSProperties = {
    width: 100,
    marginLeft: '40%',
    marginTop: '10em'
}

export const LoaderRowCenter = () => <Row>
    <Loader size="lg" style={loaderStyle} />
</Row>
