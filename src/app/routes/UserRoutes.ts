import Router from '@koa/router'
import UsersController from '../controllers/UsersController'

const usersController = new UsersController()

const userRouter = new Router({
  prefix: '/users'
})

userRouter.get('/', usersController.index)
userRouter.post('/', usersController.create)

export default userRouter
