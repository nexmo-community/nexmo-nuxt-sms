require('dotenv').config()
const Nexmo = require('nexmo')

const nexmo = new Nexmo({
  apiKey: process.env.NEXMO_API_KEY,
  apiSecret: process.env.NEXMO_API_SECRET
})

export default function (req, res, next) {
  console.log(req.method, req.url)
  if (req.method === 'GET') {
    const url = new URL(req.url, `http://${req.headers.host}`)

    nexmo.message.sendSms(
      process.env.FROM_NUMBER,
      url.searchParams.get('number'),
      url.searchParams.get('text'),
      (err, responseData) => {
        let message

        if (err) {
          message = JSON.stringify(err)
        } else if (responseData.messages[0].status === '0') {
          message = 'Message sent successfully.'
        } else {
          message = `Message failed with error: ${responseData.messages[0]['error-text']}`
        }

        res
          .writeHead(200, {
            'Content-Length': Buffer.byteLength(message),
            'Content-Type': 'text/plain'
          })
          .end(message)
      }
    )
  } else {
    res.statusCode = 200
    res.end()
  }
}
