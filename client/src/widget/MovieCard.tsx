import React, { FunctionComponent, CSSProperties } from 'react'
import { BasicMovie } from './../models/Movie';
import { useHistory } from 'react-router-dom';

const movieCardStyle: CSSProperties = {
    margin: 16,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 8,
    //width: "100%",
    width: 200, 
    height: 400
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
                <h4 style={{ textAlign: 'center' }}>{movie.name}</h4>
            </div>
        </div>
    )
}
