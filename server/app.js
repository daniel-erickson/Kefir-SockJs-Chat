import sockjs from 'sockjs'
import http from 'http'

const clients = {}

const broadcast = message => {
  for( let client in clients){
    clients[client].write(JSON.stringify(message))
  }
}

const echo = sockjs.createServer()

echo.on('connection', connection => {
  clients[connection.id] = connection
  connection.on('data', message => broadcast(JSON.parse(message)))
  connection.on('close', () => delete clients[connection.id])
})

const server = http.createServer()

echo.installHandlers(server, {prefix:'/echo'})

server.listen(9090, '0.0.0.0')

