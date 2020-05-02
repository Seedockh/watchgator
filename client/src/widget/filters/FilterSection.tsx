import React, { FunctionComponent } from 'react'
import { Row, Col } from 'rsuite'

type FilterSectionProps = {
    title: string;
}

export const FilterSection: FunctionComponent<FilterSectionProps> = ({ title, children }) => (
    <Row className='mb-6'>
        <Col xs={24} sm={24}>
            <h5>{title}</h5>
            {children}
        </Col>
    </Row>
)
