import Koa from 'koa'
import bodyparser from 'koa-bodyparser'
import cors from '@koa/cors'
import mongoose from 'mongoose'
import router from './routes'

class App {
  public app: Koa

  public constructor () {
    this.app = new Koa()

    this.middlewares()
    this.database()
    this.routes()
  }

  private middlewares (): void {
    // bodyparser middleware
    this.app.use(bodyparser())

    // Middleware to set header that enable CORS
    this.app.use(cors())
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

  private database (): void {
    mongoose.connect('mongodb://localhost:27017/tsnode', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  }
}

export default new App().app
