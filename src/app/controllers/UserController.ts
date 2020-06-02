import { ParameterizedContext } from 'koa'
import User from '../schemas/User'

class UserController {
  public async index (ctx: ParameterizedContext): Promise<ParameterizedContext> {
    const users = await User.find()
    ctx.body = users

    return ctx
  }

  public async create (ctx: ParameterizedContext): Promise<ParameterizedContext> {
    const { email, firstName, lastName } = ctx.request.body
    const user = await User.create({
      email, firstName, lastName
    })

    ctx.body = user
    return ctx
  }
}

export default UserController
