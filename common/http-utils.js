/**
 * HTTP Headers to be used on OPTIONS requests and responses
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Request-Headers': '*'
}

/**
 * Default application response headers
 */
const defaultApplicationResponseHeaders = {
  ...corsHeaders,
  'Content-Type': 'application/json'
}

/**
 * 
 * @param event associated with the HTTP request. Example: GET, OPTIONS
 * @returns the CORS response for event equal OPTIONS, undefined otherwise
 */
const getCorsResponse = (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders
    }
  }
  return undefined
}

module.exports = {
  corsHeaders,
  defaultApplicationResponseHeaders,
  getCorsResponse,
}