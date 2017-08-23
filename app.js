const StaticServer = require('static-server')
const port = process.env.PORT || 3000

const server = new StaticServer({
  rootPath: './src',            // required, the root of the server file treer
  port: port,
  cors: '*'                // optional, defaults to undefined
})

server.start(function () {
  console.log('Server listening to', port)
})
