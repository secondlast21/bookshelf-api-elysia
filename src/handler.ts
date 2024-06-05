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

export const getDetailBookByIdHandler = (id: string, error: any) => {
  const book = books.filter((n) => n.id === id)[0]

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    }
  }

  return error(404, {
    status: 'fail',
    message: 'Book not found',
  })
}

export const addBookHandler = (body: BookInput, error: any) => {
  const id = nanoid(16)
  let finished = 'False'
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  if (!body.name) {
    return error(400, {
      status: 'fail',
      message: 'Fail to add book. Fill up the name of the book',
    })
  }

  if (Number(body.pageCount) === Number(body.readPage)) {
    finished = 'True'
  }

  if (Number(body.pageCount) < Number(body.readPage)) {
    return error(400, {
      status: 'fail',
      message: 'Fail to add book. readPage cannot be bigger than pageCount',
    })
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

  return error(400, {
    status: 'error',
    message: 'Fail to add book',
  })
}

export const editBookByIdHandler = (id: string, body: BookInput, error: any) => {
  let finished = 'False'
  const updatedAt = new Date().toISOString()

  if (!body.name) {
    return error(400, {
      status: 'fail',
      message: 'Fail to update book. Fill up the name of the book',
    })
  }

  if (Number(body.pageCount) === Number(body.readPage)) {
    finished = 'True'
  }

  if (Number(body.pageCount) < Number(body.readPage)) {
     return error(400, {
       status: 'fail',
       message: 'Fail to add book. readPage cannot be bigger than pageCount',
     })
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
      message: 'Book updated',
    }
  }

   return error(404, {
     status: 'fail',
     message: 'Fail to update book. Id not found',
   })
}

export const deleteBookByIdHandler = (id: string, error: any) => {
  const idx = books.findIndex((book) => book.id === id)

  if (idx >= 0) {
    books.splice(idx, 1)
    return {
      status: 'success',
      message: 'Book deleted',
    }
  }

  return error(404, {
    status: 'fail',
    message: 'Fail to delete book. Id not found',
  })
}