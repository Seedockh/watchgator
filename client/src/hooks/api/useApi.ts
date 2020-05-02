import { BaseResponse } from './../../models/BaseResponse';
import { Actor } from './../../models/Actor';
import { ApiHook, ApiHookSearch } from '../../models/ApiHook';
import { useState, useEffect } from 'react';

export function useApi<T>(route: string, method = 'GET', body?: string): ApiHook<T> {
    const [fetchState, setFetchState] = useState<ApiHook<T>>({
        isLoading: true
    });

    const fetchData = async () => {
        setFetchState({ ...fetchState, isLoading: true })
        const res = await fetch(`${process.env.REACT_APP_API_URI}${route}`, {
            method,
            ...(body ? { body } : {})
        });

        res.json()
            .then(res => setFetchState({ isLoading: false, data: res }))
            .catch(err => {
                console.log(err);
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

export const useSearchActors = (): ApiHookSearch<BaseResponse<Actor[]>> => {
    const [query, setQuery] = useState('')

    return {
        ...useApi<BaseResponse<Actor[]>>('/peoples/find', 'POST', JSON.stringify({
            firstname: query,
            lastname: query,
            matchCase: false
        })),
        search: setQuery
    }
}