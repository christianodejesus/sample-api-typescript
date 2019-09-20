import fs from 'fs'
import path from 'path'
import Router from 'koa-router'

const mainRouter = new Router({
  prefix: '/api'
})

mainRouter.get('/', ctx => {
  ctx.body = {
    name: 'Api',
    version: process.env.API_VERSION || '1.0.0',
    description: 'Rest API'
  }
})

// import all *Route.ts files in the directory
fs.readdirSync(__dirname)
  .filter(
    file =>
      file.indexOf('.') !== 0 &&
      file !== path.basename(__filename) &&
      file.slice(-8) === 'Route.ts'
  )
  .forEach(async file => {
    const childRouter = await import(path.join(__dirname, file)).then(module => module.default)
    mainRouter.use(childRouter.routes(), childRouter.allowedMethods())
  })

export default mainRouter
