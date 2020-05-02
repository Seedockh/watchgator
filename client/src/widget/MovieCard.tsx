import React, { FunctionComponent, CSSProperties } from 'react'
import { BasicMovie } from './../models/Movie';
import { useHistory } from 'react-router-dom';
import { Panel } from 'rsuite';

const movieCardStyle: CSSProperties = {
    margin: 16,
    width: 200, 
    height: 400
}

type MovieCardProps = {
    movie: BasicMovie;
}

export const MovieCard: FunctionComponent<MovieCardProps> = ({ movie }) => {
    const history = useHistory()

    return (
        <Panel className="grow" bodyFill shaded style={movieCardStyle} onClick={() => {
            history.push(`/movies/${movie.id}`)
        }}>
            <div className="poster">
                <img src={movie.imageUrl} alt={movie.name} style={{ width: '100%', borderRadius: 8 }} />
            </div>
            <div className='p-4'>
                <h4 className='text-center'>{movie.name}</h4>
            </div>
        </Panel>
    )
}
