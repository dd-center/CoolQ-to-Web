const WebSocket = require('ws')
const { createServer } = require('http')
const { parse } = require('url')

const ws = new WebSocket('ws://127.0.0.1:6822')
const server = createServer()

let cache = {}
let wss = {}

ws.on('open', () => console.log('Master Online'))

ws.on('message', json => {
  let { data, group } = JSON.parse(json)
  if (!cache[group]) {
    cache[group] = []
  }
  if (wss[group]) {
    wss[group].clients
      .forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data)
        }
      })
  }
  cache[group].push(data)
  setTimeout(() => cache[group].shift(), 1000 * 60 * 60)
})

const createWsServer = pathname => {
  wss[pathname] = new WebSocket.Server({ noServer: true })
  // wss[pathname].on('connection', () => console.log('connect', pathname))
  wss[pathname].on('connection', client => {
    if ((cache[pathname] || []).length) {
      client.send(cache[pathname].join('\n'))
    }
  })
}

server.on('upgrade', (request, socket, head) => {
  const pathname = Number(parse(request.url).pathname.replace('/', ''))

  if (!Number.isNaN(pathname)) {
    if (!wss[pathname]) {
      createWsServer(pathname)
    }
    wss[pathname].handleUpgrade(request, socket, head, ws => wss[pathname].emit('connection', ws, request))
  }
})

server.listen(6823)
