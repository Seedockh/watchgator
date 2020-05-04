import React, { FunctionComponent, CSSProperties } from 'react'
import LazyLoad from 'react-lazyload'
import { Movie } from './../models/api/Movie';
import { useHistory } from 'react-router-dom';
import { Panel } from 'rsuite';
import { addPictureUrlSize } from '../utils/movieUtils';

const movieCardStyle: CSSProperties = {
    margin: 16,
    width: 200,
    height: 400
}

type MovieCardProps = {
    movie: Movie;
}

export const MovieCard: FunctionComponent<MovieCardProps> = ({ movie }) => {
    const history = useHistory()
    const goToDetails = () => {
      history.push({
        pathname: `/movies/${movie.id}`,
        state: { movie: movie }
      })
    }

    return (
        <Panel className="grow" bodyFill shaded style={movieCardStyle} onClick={goToDetails}>
            <div className="poster">
              <LazyLoad height={200}>
                <img src={addPictureUrlSize(movie.picture, 500)} alt={movie.title} style={{ width: '100%', borderRadius: 8 }} />
              </LazyLoad>
            </div>
            <div className='p-4'>
                <h5 className='text-center'>{movie.title}</h5>
            </div>
        </Panel>
    )
}
