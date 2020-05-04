export interface ApiHook<T> {
    isLoading: boolean;
    data?: T;
    error?: any;
}

export interface ApiHookSearch<T, U> extends ApiHook<T> {
    search: (query: U) => void;
    query: U;
}