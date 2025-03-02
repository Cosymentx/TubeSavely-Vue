export interface Paging<T> {
    current: number
    records: T[]
    total: number
    size: number
    pages: number
  } 