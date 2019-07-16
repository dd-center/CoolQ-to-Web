const { CQWebSocket } = require('cq-websocket')
const WebSocket = require('ws')

const config = require('./config')
const bot = new CQWebSocket(config)

const wss = new WebSocket.Server({ port: 6822 })

wss.on('connection', () => console.log('Worker Online'))

bot.on('message.group', (_, context, __) => {
  let { sender, message } = context
  let group = context.group_id
  let { card, nickname } = sender
  let name = card || nickname
  if (message.includes('【')) {
    let data = JSON.stringify({ data: `${message}(${name}`, group })
    wss.clients
      .forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data)
        }
      })
  }
})

bot.on('socket.connecting', (socketType, attempts) => {
  console.log('CONNECTING', attempts)
})

bot.on('socket.connect', (socketType, sock, attempts) => {
  console.log('CONNECT', attempts)
})

bot.on('socket.failed', (socketType, attempts) => {
  console.log('FAILED', attempts)
})

bot.connect()
