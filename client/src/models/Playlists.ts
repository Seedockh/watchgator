import { Movie } from "./api/Movie";

export class Playlist {
    constructor(
        public id: number,
        public name: string,
        public movies: Movie[],
    ) {}
}
