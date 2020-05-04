import { ApiFetch, BaseApiFetch, ApiFetchSearch } from './../../models/ApiFetch';
import { useState } from "react"

export function useApiFetch<T>(initialState?: BaseApiFetch<T>): ApiFetch<T> {
    const [apiFetch, setApiFetch] = useState<BaseApiFetch<T>>(initialState ?? {
        isLoading: false
    })

    const setData = (data?: T): void => {
        setApiFetch({ ...apiFetch, isLoading: false, data, error: undefined })
    }
    const setError = (error?: any): void => {
        setApiFetch({ ...apiFetch, isLoading: false, data: undefined, error })
    }
    const setLoading = (isLoading: boolean): void => {
        setApiFetch({ ...apiFetch, isLoading })
    }

    return { ...apiFetch, setData, setError, setLoading };
}

export function useApiFetchSearch<T, U>(initialState?: BaseApiFetch<T>): ApiFetchSearch<T, U> {
    const apiFetch = useApiFetch(initialState)
    const [query, setQuery] = useState<U>()

    return { ...apiFetch, search: setQuery, query };
}