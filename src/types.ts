export interface Book {
    id: string
    name: string
    year: string
    author: string
    summary: string
    publisher: string
    pageCount: string
    readPage: string
    finished: string
    reading: string
    insertedAt: string
    updatedAt: string
}

export interface BookSearch {
    name?: string
    reading?: string
    finished?: string
}

export interface BookInput {
    name: string
    year: string
    author: string
    summary: string
    publisher: string
    pageCount: string
    readPage: string
    reading: string
}