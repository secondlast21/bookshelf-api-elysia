import { nanoid } from 'nanoid'
import { Book, BookInput, BookSearch } from './types'
import { books } from './books'

const returnBookList = (bookList: Book[]) => {
  const response = {
    status: 'success',
    total_books: bookList.length,
    data: {
      books: bookList.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  }
  return response
}

export const getAllBookHandler = (query: BookSearch) => {
  if (query.name === undefined && query.reading === undefined && query.finished === undefined) {
    return returnBookList(books)
  }

  if (query.name) {
    const filteredBooks = books.filter((book) => book.name.toLowerCase().includes(query?.name.toLowerCase()))
    return returnBookList(filteredBooks)
  }

  if (query.reading) {
    const filteredBooks = books.filter((book) =>
      query.reading === '1' ? book.reading === 'True' : book.reading === 'False'
    )
    return returnBookList(filteredBooks)
  }

  if (query.finished) {
    const filteredBooks = books.filter((book) =>
      query.finished === '1' ? book.finished === 'True' : book.finished === 'False'
    )
    return returnBookList(filteredBooks)
  }

  return books
}

export const getDetailBookByIdHandler = (id: string, set: any) => {
  const book = books.filter((n) => n.id === id)[0]

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    }
  }

  set.status = 404
  return {
    status: 'fail',
    message: 'Book not found',
  }
}

export const addBookHandler = (body: BookInput, set: any) => {
  const id = nanoid(16)
  let finished = 'False'
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  if (body.name === undefined || null || '') {
    const response = {
      status: 'fail',
      message: 'Fail to add book. Fill up the name of the book',
    }

    set.status = 400
    return response
  }

  if (Number(body.pageCount) === Number(body.readPage)) {
    finished = 'True'
  }

  if (Number(body.pageCount) < Number(body.readPage)) {
    const response = {
      status: 'fail',
      message: 'Fail to add book. readPage cannot be bigger than pageCount',
    }

    set.status = 400
    return response
  }

  const newBook = {
    id,
    name: body.name,
    year: body.year,
    author: body.author,
    summary: body.summary,
    publisher: body.publisher,
    pageCount: body.pageCount,
    readPage: body.readPage,
    finished,
    reading: body.reading,
    insertedAt,
    updatedAt,
  }

  books.push(newBook)

  const isSuccess = books.filter((books) => books.id === id).length > 0

  if (isSuccess) {
    const response = {
      status: 'success',
      message: 'Add book success',
      data: {
        bookId: id,
      },
    }
    return response
  }

  const response = {
    status: 'error',
    message: 'Fail to add book',
  }

  set.status = 400
  return response
}

export const editBookByIdHandler = (id: string, body: BookInput, set: any) => {
  let finished = 'False'
  const updatedAt = new Date().toISOString()

  if (body.name === undefined || null || '') {
    set.status = 400
    return {
      status: 'fail',
      message: 'Fail to update book. Fill up the name of the book',
    }
  }

  if (Number(body.pageCount) === Number(body.readPage)) {
    finished = 'True'
  }

  if (Number(body.pageCount) < Number(body.readPage)) {
    set.status = 400
    return {
      status: 'fail',
      message: 'Fail to update book. readPage cannot be bigger than pageCount',
    }
  }

  const idx = books.findIndex((book) => book.id === id)

  if (idx !== -1) {
    books[idx] = {
      ...books[idx],
      name: body.name,
      year: body.year,
      author: body.author,
      summary: body.summary,
      publisher: body.publisher,
      pageCount: body.pageCount,
      readPage: body.readPage,
      finished,
      reading: body.reading,
      updatedAt,
    }
    return {
      status: 'success',
      message: 'Buku berhasil diperbarui',
    }
  }

  set.status(404)
  return {
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  }
}

export const deleteBookByIdHandler = (id: string, set: any) => {
  const idx = books.findIndex((book) => book.id === id)

  if (idx >= 0) {
    books.splice(idx, 1)
    return {
      status: 'success',
      message: 'Book delete',
    }
  }

  set.status = 404
  return {
    status: 'fail',
    message: 'Fail to delete book. Id not found',
  }
}