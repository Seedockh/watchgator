export interface BaseResponse<T> {
    total: number,
    pages: number,
    results: T
}
