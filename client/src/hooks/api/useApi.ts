import { ApiHook } from '../../models/ApiHook';
import { useState, useEffect } from 'react';

export function useApi<T>(route: string, method = 'GET'): ApiHook<T> {
    const [fetchState, setFetchState] = useState<ApiHook<T>>({
        isLoading: true
    });

    const fetchData = async () => {
        setFetchState({ ...fetchState, isLoading: true })
        const res = await fetch(`${process.env.REACT_APP_API_URI}${route}`, { method });
        console.log(res);
        
        res.json()
            .then(res => {
                console.log(res);
                setFetchState({ isLoading: false, data: res })
            })
            .catch(err => {
                console.log(err);
                setFetchState({ isLoading: false, error: err })
            });
    }

    useEffect(() => {
        fetchData()
    }, []);

    return fetchState;
}

export const useAllCategories = (): ApiHook<string[]> => useApi<string[]>('/genres/all/');