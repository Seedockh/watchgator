import { MovieResponse } from './../../models/api/MoviesResponse';
import { MovieSearchPayload } from './../../models/api/MovieSearchPayload';
import { Actor } from './../../models/api/Actor';
import { BaseResponse } from '../../models/api/BaseResponse';

async function callApi<T>(route: string, method: string, body?: string): Promise<T> {
    const res = await fetch(`${process.env.REACT_APP_API_URI}${route}`, {
        method,
        ...(body ? { body } : {}),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return res.json()
}

export const getCategories = async (): Promise<string[]> => {
    return callApi<string[]>('/genres/all/', 'GET');
}

export const searchActor = async (query: string): Promise<Actor[]> => {
    if (!query || query.trim() === '') return [];

    const values = query.split(' ');
    const payload = {
        fullname: query,
        firstname: values[0],
        lastname: values[1] ?? values[0],
    }
    const response = await callApi<BaseResponse<Actor[][]>>('/peoples/find', 'POST', JSON.stringify(payload));
    if (!response || !response.results || !response.results[0]) return [];
    return response.results[0];
}

export const searchMovies = async (filters: MovieSearchPayload): Promise<MovieResponse> => {
    return callApi<MovieResponse>('/search', 'POST', JSON.stringify(filters));
}