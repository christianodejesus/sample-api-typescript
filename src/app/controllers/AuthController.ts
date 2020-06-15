import httpStatus from 'http-status'
import { ParameterizedContext } from 'koa'
import User from '../schemas/User'

interface ILoginValidation {
  email?: string
  password?: string
}

class AuthController {
  public async login (ctx: ParameterizedContext): Promise<ParameterizedContext> {
    const { email, password } = ctx.request.body
    const fields: ILoginValidation = {}

    if (email === undefined || email === null) {
      fields.email = 'Missing email'
    }

    if (password === undefined || password === null) {
      fields.password = 'Missing password'
    }

    if (Object.keys(fields).length > 0) {
      ctx.status = httpStatus.BAD_REQUEST
      ctx.body = {
        message: 'Validation errors. Please, verify data sent.',
        fields
      }
    } else {
      const user = await User.findOne({
        email,
        isActive: true
      })

      if (!user) {
        ctx.status = httpStatus.BAD_REQUEST
        ctx.body = { message: 'User not found' }
      } else {
        if (user.passwordHash === null) {
          ctx.status = httpStatus.BAD_REQUEST
          ctx.body = { message: 'User account is not activated' }
        } else {
          if (user.checkPassword(password)) {
            const { id, name, email } = user

            ctx.status = httpStatus.OK
            ctx.body = {
              user: {
                id, name, email
              },
              token: user.generateToken()
            }
          } else {
            ctx.status = httpStatus.BAD_REQUEST
            ctx.body = { message: 'Invalid password' }
          }
        }
      }
    }

    return ctx
  }
}

export default AuthController
