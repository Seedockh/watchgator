import { Playlist } from '../models/Playlists';
import { moviesList } from '../data/movies';

 export const playlists : Playlist[] = [
    {
        id: 1,
        name: "Aventure",
        movies: [
            moviesList[1],
            moviesList[2],
            moviesList[3],
            moviesList[4],
            moviesList[6],
        ]
    },
    {
        id: 2,
        name: "Romance",
        movies: [
            moviesList[1],
        ]
    },
    {
        id: 3,
        name: "Action",
        movies: [
            moviesList[11],
            moviesList[13],
        ]
    },
    {
        id: 4,
        name: "Comedie",
        movies: [
            moviesList[3],
            moviesList[4],
            moviesList[11],
            moviesList[13],
        ]
    },
]