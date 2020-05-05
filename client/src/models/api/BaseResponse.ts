export interface BaseResponse<T> {
    total: number,
    time: number,
    pages: number,
    results: T
}
