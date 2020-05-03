import { MinMax } from './MinMax';
import { Actor } from './Actor';

export interface MovieFilter {
    categories: string[];
    actors: Actor[];
    years: MinMax;
    rating: MinMax;
}