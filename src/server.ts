import App from './app'

const app = (new App()).app

const server = app.listen(Number(process.env.API_PORT))

export default server
