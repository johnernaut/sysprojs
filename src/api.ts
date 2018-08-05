export type ApiResult<T> = ResultSuccess<T> | ResultFail<ErrorResource>

export interface ErrorResource {
  status?: number
  title?: string
  detail?: string
  source?: string
}

export interface ResultSuccess<T> {
  type: 'success'
  ok: true
  value: T
}

export interface ResultFail<T> {
  type: 'failure'
  ok: false
  error: T
}
