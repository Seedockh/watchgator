import React, { FunctionComponent, CSSProperties } from 'react'
import { BasicMovie } from './../models/Movie';
import { RatingStars } from './RatingStars';
import { TagGroup, Tag } from 'rsuite';
import { useHistory } from 'react-router-dom';

const movieCardStyle: CSSProperties = {
    margin: 16,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 8
}

type MovieCardProps = {
    movie: BasicMovie;
}

export const MovieCard: FunctionComponent<MovieCardProps> = ({ movie }) => {
    const history = useHistory()

    return (
        <div className="grow" style={movieCardStyle} onClick={() => {
            history.push(`/movies/${movie.id}`)
        }}>
            <div className="poster">
                <img src={movie.imageUrl} alt={movie.name} style={{ width: '100%', borderRadius: 8 }} />
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
