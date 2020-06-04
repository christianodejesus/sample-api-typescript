import Router from '@koa/router'
import fs from 'fs'
import path from 'path'

const mainRouter = new Router({
  prefix: '/api'
})

mainRouter.get('/', ctx => {
  ctx.body = {
    name: 'Ecoleta Rest API',
    version: process.env.API_VERSION || '1.0.0'
  }
})

const ext = path.extname(__filename)

// import all *Routes files in the directory
fs.readdirSync(__dirname)
  .filter(
    file =>
      file.indexOf('.') !== 0 &&
      file !== path.basename(__filename) &&
      file.slice(-9) === `Routes${ext}`
  )
  .forEach(async file => {
    const childRouter = await import(path.join(__dirname, file)).then(module => module.default)
    mainRouter.use(childRouter.routes(), childRouter.allowedMethods())
  })

export default mainRouter
