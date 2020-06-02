import Router from '@koa/router'
import UserController from '../controllers/UserController'

const userController = new UserController()

const userRouter = new Router({
  prefix: '/users'
})

userRouter.get('/', userController.index)
userRouter.post('/', userController.create)

export default userRouter
