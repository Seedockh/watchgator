import { MinMax } from './api/MinMax';
import { Actor } from './api/Actor';

export interface MovieFilter {
    categories: string[];
    actors: Actor[];
    years: MinMax;
    rating: MinMax;
    runtime: MinMax;
    metaScore: MinMax;
}