import React, { FunctionComponent } from 'react'
import { Icon } from 'rsuite'

type RatingProps = {
    rating: number
}

export const RatingStars: FunctionComponent<RatingProps> = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const isHalfStar = fullStars < rating;

    return <div className="rating">
        {Array(fullStars).fill(0).map((_) => <Icon icon='star' size='2x' style={{ color: '#FDCC0D'}} />)}
        {isHalfStar && <Icon icon='star-half' size='2x' />}
    </div>
}
