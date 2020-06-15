import { ParameterizedContext } from 'koa'
import App from '../index'

class AppController {
  public getState (ctx: ParameterizedContext): Record<string, unknown> {
    return ctx.state[App.decodedTokenDataKey]
  }
}

export default AppController
