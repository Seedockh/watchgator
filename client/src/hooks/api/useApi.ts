import { MovieResponse } from './../../models/api/MoviesResponse';
import { BaseResponse } from './../../models/api/BaseResponse';
import { Actor } from './../../models/Actor';
import { ApiHook, ApiHookSearch } from '../../models/ApiHook';
import { useState, useEffect } from 'react';
import { MovieSearchPayload } from '../../models/api/MovieSearchPayload';

export function useApi<T>(route: string, method = 'GET', body?: string): ApiHook<T> {
    const [fetchState, setFetchState] = useState<ApiHook<T>>({
        isLoading: true
    });

    const fetchData = async () => {
        setFetchState({ ...fetchState, isLoading: true })
        const res = await fetch(`${process.env.REACT_APP_API_URI}${route}`, {
            method,
            ...(body ? { body } : {}),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        res.json()
            .then(res => setFetchState({ isLoading: false, data: res }))
            .catch(err => {
                console.log("API ERROR", err);
                setFetchState({ isLoading: false, error: err })
            });
    }

    useEffect(() => {
        console.log('Call only once or when body change', route);

        fetchData()
    }, [body]);

    return fetchState;
}

export const useAllCategories = (): ApiHook<string[]> => useApi<string[]>('/genres/all/');
// export const useConnectUser = (values: object): ApiHook<string[]> => return () useApi<string[]>('/auth/signin', "POST", JSON.stringify(values));

export const useSearchActors = (): ApiHookSearch<BaseResponse<Actor[][]>, string> => {
    const [query, setQuery] = useState<string>('')

    const values = query?.split(' ') ?? [''];
    const payload = query !== '' ? {
        fullname: query,
        firstname: values[0],
        lastname: values[1] ?? values[0],
    } : {}
    return {
        ...useApi<BaseResponse<Actor[][]>>('/peoples/find', 'POST', JSON.stringify(payload)),
        search: setQuery,
        query
    }
}

export const useSearchMovies = (): ApiHookSearch<MovieResponse, MovieSearchPayload> => {
    const [query, setQuery] = useState<MovieSearchPayload>({})

    return {
        ...useApi<MovieResponse>('/search', 'POST', JSON.stringify(query)),
        search: setQuery,
        query
    }
}