export interface ApiHook<T> {
    isLoading: boolean;
    data?: T;
    error?: any;
}