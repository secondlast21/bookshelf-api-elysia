import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { cors } from '@elysiajs/cors'
import { getAllBookHandler, addBookHandler, getDetailBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler } from './handler'

const app = new Elysia()

app
  .use(swagger())
  .use(cors())
  .get('/', () => 'Hello Elysia')
  .group('/books', (app) => {
    return app
      .get('/', ({ query }) => getAllBookHandler(query), {
        query: t.Object(
          {
            name: t.Optional(t.String()),
            reading: t.Optional(t.String()),
            finished: t.Optional(t.String()),
          },
          {
            error: {
              status: 'fail',
              message: 'Parameter is not available',
            },
          }
        ),
      })
      .get('/:id', ({ params: { id }, set }) => getDetailBookByIdHandler(id, set))
      .delete('/:id', ({ params: { id }, set }) => deleteBookByIdHandler(id, set))
      .post(
        '/',
        async ({ body, set }) => {
          const book = addBookHandler(body, set)
          return book
        },
        {
          body: t.Object({
            name: t.String(),
            year: t.String(),
            author: t.String(),
            summary: t.String(),
            publisher: t.String(),
            pageCount: t.String(),
            readPage: t.String(),
            reading: t.String(),
          }),
        }
      )
      .put('/:id', ({ params: { id }, body, set }) => editBookByIdHandler(id, body, set), {
        body: t.Object({
          name: t.String(),
          year: t.String(),
          author: t.String(),
          summary: t.String(),
          publisher: t.String(),
          pageCount: t.String(),
          readPage: t.String(),
          reading: t.String(),
        }),
      })
  })
  .listen(8080, () => {
    console.log('Server running on http://localhost:8080')
  })
