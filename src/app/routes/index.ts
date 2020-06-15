import Router from '@koa/router'
import fs from 'fs'
import path from 'path'

const publicMainRouter = new Router({
  prefix: '/public'
})

const privateMainRouter = new Router({
  prefix: '/pvt'
})

publicMainRouter.get('/', ctx => {
  ctx.body = {
    name: 'Sample Rest API',
    version: process.env.API_VERSION || '1.0.0'
  }
})

const ext = path.extname(__filename)

const loadRouterFiles = (basedir: string, router: Router): void => {
  // import all *Routes files in the directory
  fs.readdirSync(basedir)
    .filter(
      file =>
        file.indexOf('.') !== 0 &&
        file !== path.basename(__filename) &&
        file.slice(-9) === `Routes${ext}`
    )
    .forEach(async file => {
      const childRouter = await import(path.join(basedir, file)).then(module => module.default)
      router.use(childRouter.routes(), childRouter.allowedMethods())
    })
}

loadRouterFiles(`${__dirname}/public`, publicMainRouter)
loadRouterFiles(`${__dirname}/private`, privateMainRouter)

export default {
  publicMainRouter, privateMainRouter
}
