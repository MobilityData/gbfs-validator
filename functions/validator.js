const GBFS = require('gbfs-validator')

exports.handler = function(event, context, callback) {
  const gbfs = new GBFS(event.body)

  gbfs
    .validation()
    .then(result => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
      })
    })
    .catch(err => {
      callback(err, {
        statusCode: 500,
        body: JSON.stringify(err)
      })
    })
}
