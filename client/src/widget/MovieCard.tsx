import React, { FunctionComponent } from 'react'
import { BasicMovie } from './../models/Movie';
import { Card } from './Card';
import { RatingStars } from './RatingStars';
import { TagGroup, Tag } from 'rsuite';

type MovieCardProps = {
    movie: BasicMovie
}

export const MovieCard: FunctionComponent<MovieCardProps> = ({ movie }) => {
    return (
        <div style={{ margin: 16, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
            <div className="poster">
                <img src={movie.imageUrl} style={{ width: '100%', borderRadius: 8 }} />
            </div>
            <div style={{ padding: 16 }}>
                <h4>{movie.name}</h4>

                <div className="rating">
                    <RatingStars rating={movie.rating} />
                    <span style={{marginLeft: 8}}>{movie.rating}/5</span>
                </div>

                <TagGroup style={{marginTop: 12}}>
                    {movie.categories.map((category) => <Tag>{category}</Tag>)}
                </TagGroup>
            </div>
        </div>
    )
}
