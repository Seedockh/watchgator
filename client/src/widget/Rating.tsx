import React, { FunctionComponent } from 'react'
import { Icon } from 'rsuite'

type RatingProps = {
    rating: number
}

export const Rating: FunctionComponent<RatingProps> = ({ rating }) => (
    <div className="rating">
        {Array(rating).fill(0).map((_) => (
            <Icon icon='star' />
        ))}
        <span style={{ marginLeft: 8 }}>{rating}/5</span>
    </div>
)
