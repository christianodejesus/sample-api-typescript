import Router from '@koa/router'
import UserController from '../controllers/UserController'

const userRouter = new Router({
  prefix: '/users'
})

userRouter.get('/', UserController.index)
userRouter.post('/', UserController.create)

export default userRouter
