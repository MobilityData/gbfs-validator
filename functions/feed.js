const GBFS = require('gbfs-validator')

getCorsResponse = (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*", // Allow all domains
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "*"
    // "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  };

  // Handle OPTIONS method for preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
    };
  }
  return undefined
}

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
      statusCode: 500,
      body: JSON.stringify(err)
    })
  }

  const gbfs = new GBFS(body.url)

  gbfs
    .getFiles()
    .then((result) => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
      })
    })
    .catch((err) => {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify(err.message)
      })
    })
}
