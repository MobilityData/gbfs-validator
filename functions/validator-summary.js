const GBFS = require('gbfs-validator')

const getSummary = (validationResult) => (
  {
    ...validationResult,
    files: undefined,
    filesSummary: (validationResult.files || []).map(item => ({
      required: item.required,
      exists: item.exists,
      file: item.file,
      hasErrors: item.hasErrors,
      errorsCount: item.errorsCount
    }))
  }
)

exports.handler = function (event, context, callback) {
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
        body: JSON.stringify(getSummary(result))
      })
    })
    .catch(err => {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify(err.message)
      })
    })
}
