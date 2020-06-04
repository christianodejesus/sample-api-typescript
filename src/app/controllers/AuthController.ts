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
      fields.email = 'Email não informado'
    }

    if (password === undefined || password === null) {
      fields.password = 'Senha não informada'
    }

    if (Object.keys(fields).length > 0) {
      ctx.status = httpStatus.BAD_REQUEST
      ctx.body = {
        message: 'Atenção, foram encontrados erro(s) no formulário. Por favor, verifique os dados informados.',
        fields
      }
    } else {
      const user = await User.findOne({
        email,
        isActive: true
      })

      if (!user) {
        ctx.status = httpStatus.NOT_FOUND
        ctx.body = { message: 'Usuário não encontrado' }
      } else {
        if (user.passwordHash === null) {
          ctx.status = httpStatus.UNAUTHORIZED
          ctx.body = { message: 'A conta do usuário não foi ativada' }
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
            ctx.status = httpStatus.UNAUTHORIZED
            ctx.body = { message: 'Senha inválida' }
          }
        }
      }
    }

    return ctx
  }
}

export default AuthController
