import app from './app'

const server = app.listen(Number(process.env.API_PORT))

export default server
