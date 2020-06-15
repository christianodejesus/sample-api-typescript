import cors from '@koa/cors'
import { config } from 'dotenv'
import httpStatus from 'http-status'
import Koa, { Next, ParameterizedContext } from 'koa'
import bodyparser from 'koa-bodyparser'
import koaJWT from 'koa-jwt'
import KoaLogger from 'koa-logger'
import mongoose from 'mongoose'
import routes from './routes'

config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' })

class App {
  public static decodedTokenDataKey = 'tokenData'
  public app: Koa

  public constructor () {
    this.app = new Koa()

    this.middlewares()
    this.database()
    this.routes()
  }

  private middlewares (): void {
    // dev logger middleware
    if (process.env.NODE_ENV === 'development') {
      this.app.use(KoaLogger())
    }

    // bodyparser middleware
    this.app.use(bodyparser())

    // Middleware to set header that enable CORS
    this.app.use(cors({ credentials: true }))

    // Middleware to handle exceptions
    this.app.use(async (ctx: ParameterizedContext, next: Next) => {
      try {
        await next()
      } catch (err) {
        ctx.body = {}

        if (err.name === 'UnauthorizedError') {
          ctx.status = httpStatus.UNAUTHORIZED
          switch (err.originalError.name) {
            case 'TokenExpiredError':
              ctx.body.message = 'Token expired'
              break

            case 'JsonWebTokenError':
              ctx.body.message = 'Invalid token'
              break
          }
        } else {
          ctx.status = httpStatus.INTERNAL_SERVER_ERROR
          ctx.body = { message: 'An unexpected error are occurred' }

          if (process.env.NODE_ENV === 'development') {
            const { name, message, stack, parent, original } = err
            ctx.body.error = {
              name, message, stack, parent, original
            }
          }
        }
      }
    })
  }

  private routes (): void {
    // use the public app routes
    this.app.use(routes.publicMainRouter.routes())
    this.app.use(routes.publicMainRouter.allowedMethods())

    // protecting private routes under JWT auth validation
    this.app.use(koaJWT({
      secret: process.env.APP_SECRET || '',
      key: App.decodedTokenDataKey
    }))

    // use the private app routes
    this.app.use(routes.privateMainRouter.routes())
    this.app.use(routes.privateMainRouter.allowedMethods())
  }

  private database (): void {
    const userStr = process.env.DB_USER !== undefined && process.env.DB_USER !== ''
      ? `${process.env.DB_USER}:${process.env.DB_PASS}@`
      : ''
    const portStr = process.env.DB_PORT !== undefined && Number(process.env.DB_PORT) > 0
      ? `:${process.env.DB_PORT}`
      : ''

    const connectionStr = `${process.env.DB_PROTOCOL}://${userStr}${process.env.DB_HOST}${portStr}/${process.env.DB_NAME}`

    mongoose.connect(connectionStr, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
      useCreateIndex: true
    })
  }
}

export default App
