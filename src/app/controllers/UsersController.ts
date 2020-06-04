import { ParameterizedContext } from 'koa'
import User from '../schemas/User'

class UsersController {
  public async index (ctx: ParameterizedContext): Promise<ParameterizedContext> {
    const users = await User.find()
    ctx.body = users

    return ctx
  }

  public async create (ctx: ParameterizedContext): Promise<ParameterizedContext> {
    const { email, name, password } = ctx.request.body

    const user = await User.create({
      name,
      email,
      password
    })

    ctx.body = {
      user
    }

    return ctx
  }
}

export default UsersController
