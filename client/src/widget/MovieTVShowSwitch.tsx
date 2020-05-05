import React, { FunctionComponent } from 'react'

export type SwitchValue = 'movies' | 'tvshows'

type MovieTVShowSwitchProps = {
    type: SwitchValue;
    onSwitch: (type: SwitchValue) => void;
}

export const MovieTVShowSwitch: FunctionComponent<MovieTVShowSwitchProps> = ({ type, onSwitch }) => {
    const slash = <small>/</small>
    if (type === 'movies') {
        return <span>Movies {slash} <small onClick={() => onSwitch('tvshows')}>TV Shows</small></span>
    }
    return <span><small onClick={() => onSwitch('movies')}>Movies</small> {slash} TV Shows</span>
}
