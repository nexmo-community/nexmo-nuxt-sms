const WebSocket = require('ws')
let websocket = {}
const wss = new WebSocket.Server({ port: 3001 })
wss.on('connection', (ws) => {
  websocket = ws
})

export default function (req, res, next) {
  console.log(req.method, req.url)
  if (req.method === 'POST') {
    const body = []
    req.on('data', (chunk) => {
      body.push(chunk)
    })
    req.on('end', () => {
      const sms = JSON.parse(body)
      console.log(sms)
      websocket.send(`Message from ${sms.msisdn}: ${sms.text}`)
    })
  }

  res.statusCode = 200
  res.end()
}
