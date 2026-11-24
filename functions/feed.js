const GBFS = require('gbfs-validator');
const { defaultApplicationResponseHeaders, getCorsResponse } = require('../common/http-utils');

exports.handler = async function (event) {
  const corsResponse = getCorsResponse(event);
  if (corsResponse !== undefined) {
    return corsResponse
  }

  let body

  try {
    body = JSON.parse(event.body)
  } catch (err) {
    return {
      headers: defaultApplicationResponseHeaders,
      statusCode: 500,
      body: JSON.stringify(err.message)
    }
  }

  try {
    const gbfs = new GBFS(body.url)
    const result = await gbfs.getFiles()

    return {
      headers: defaultApplicationResponseHeaders,
      statusCode: 200,
      body: JSON.stringify(result)
    }
  } catch (err) {
    return {
      headers: defaultApplicationResponseHeaders,
      statusCode: 500,
      body: JSON.stringify(err.message)
    }
  }
}
