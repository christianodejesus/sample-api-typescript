import cors from '@koa/cors'
import { config } from 'dotenv'
import Koa, { Next, ParameterizedContext } from 'koa'
import bodyparser from 'koa-bodyparser'
import KoaLogger from 'koa-logger'
import mongoose from 'mongoose'
import router from './routes'

config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' })

class App {
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
        ctx.status = 500
        ctx.body = { message: 'An unexpected error are occurred' }

        if (process.env.NODE_ENV === 'development') {
          const { message, name } = Error(err)
          ctx.body.error = { message, name }
        }
      }
    })
  }

  private routes (): void {
    // redirects routes from /* to /api/*
    this.app.use(async (ctx, next) => {
      if (ctx.url === '/') {
        ctx.redirect('/api')
      }

      await next()
    })

    // use the app routes
    this.app.use(router.routes())
    this.app.use(router.allowedMethods())
  }

  private database () {
    const userStr = process.env.DB_USER !== undefined && process.env.DB_USER !== ''
      ? `${process.env.DB_USER}:${process.env.DB_PASS}@`
      : ''
    const portStr = process.env.DB_PORT !== undefined && Number(process.env.DB_PORT) > 0
      ? `:${process.env.DB_PORT}`
      : ''

    const connectionStr = `${process.env.DB_PROTOCOL}://${userStr}${process.env.DB_HOST}${portStr}/${process.env.DB_NAME}`

    mongoose.connect(connectionStr, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  }
}

export default App
