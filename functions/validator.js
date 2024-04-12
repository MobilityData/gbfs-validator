const GBFS = require('gbfs-validator');
const { defaultApplicationResponseHeaders, getCorsResponse } = require('../common/http-utils');

exports.handler = function (event, context, callback) {
  const corsResponse = getCorsResponse(event);
  if (corsResponse !== undefined) {
    callback(null, corsResponse)    
    return;
  }

  let body

  try {
    body = JSON.parse(event.body)
  } catch (err) {
    callback(err, {
      headers: defaultApplicationResponseHeaders,
      statusCode: 500,
      body: JSON.stringify(err)
    })
  }

  const gbfs = new GBFS(body.url, body.options)

  gbfs
    .validation()
    .then((result) => {
      callback(null, {
        headers: defaultApplicationResponseHeaders,
        statusCode: 200,
        body: JSON.stringify(result)
      })
    })
    .catch((err) => {
      callback(null, {
        headers: defaultApplicationResponseHeaders,
        statusCode: 500,
        body: JSON.stringify(err.message)
      })
    })
}
