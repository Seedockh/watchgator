import React, { FunctionComponent } from 'react'
import { Icon } from 'rsuite'

type RatingStarsProps = {
    rating: number
}

export const RatingStars: FunctionComponent<RatingStarsProps> = ({ rating }) => {
    return <>
        {Array(rating).fill(0).map((_) => (
            <Icon icon='star' />
        ))}
    </>
}
