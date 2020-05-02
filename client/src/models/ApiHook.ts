export interface ApiHook<T> {
    isLoading: boolean;
    data?: T;
    error?: any;
}

export interface ApiHookSearch<T> extends ApiHook<T> {
    search: (query: string) => void;
}