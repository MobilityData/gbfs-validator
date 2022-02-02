const GBFS = require('gbfs-validator')

exports.handler = function(event, context, callback) {
  let body

  try {
    body = JSON.parse(event.body)
  } catch (err) {
    callback(err, {
      statusCode: 500,
      body: JSON.stringify(err)
    })
  }

  const gbfs = new GBFS(body.url, body.options)

  gbfs
    .validation()
    .then(result => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
      })
    })
    .catch(err => {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify(err.message)
      })
    })
}
