const { CQWebSocket } = require('cq-websocket')
const config = require('./config')
const bot = new CQWebSocket(config)

bot.on('message.group', (_, { sender, message }, __) => {
  let { card, nickname } = sender
  let name = card || nickname
  if (message.includes('【')) {
    console.log(`${message}(${name}`)
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
