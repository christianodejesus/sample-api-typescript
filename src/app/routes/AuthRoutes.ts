import Router from '@koa/router'
import AuthController from '../controllers/AuthController'

const authController = new AuthController()

const authRouter = new Router({
  prefix: '/auth'
})

authRouter.post('/login', authController.login)

export default authRouter
