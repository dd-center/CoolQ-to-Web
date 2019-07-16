const WebSocket = require('ws')

const ws = new WebSocket('ws://127.0.0.1:6822')

ws.on('open', () => console.log('Master Online'))

ws.on('message', json => {
  let { data, group } = JSON.parse(json)
})
