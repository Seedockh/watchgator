export interface BaseApiFetch<T> {
    isLoading: boolean;
    data?: T;
    error?: any;
}

export interface ApiFetch<T> extends BaseApiFetch<T> {
    setData: (data?: T) => void;
    setError: (error?: any) => void;
    setLoading: (loading: boolean) => void;
}

export interface ApiFetchSearch<T, U> extends ApiFetch<T> {
    search: (query: U) => void;
    query?: U;
}
