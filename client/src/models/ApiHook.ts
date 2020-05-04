export interface ApiHook<T> {
    isLoading: boolean;
    data?: T;
    error?: any;
    type?: Object
}

export interface ApiHookSearch<T, U> extends ApiHook<T> {
    search: (query: U) => void;
    query: U;
}