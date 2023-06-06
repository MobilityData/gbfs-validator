const GBFS = require('gbfs-validator')

/** @typedef {{
 *             summary: {
 *               validatorVersion: string,
 *               hasErrors: boolean,
 *               errorsCount: number,
 *               version: {
 *                 detected: string,
 *                 validated: string  
 *                }
 *               filesSummary: [
 *                {
 *                  required: boolean,
 *                  exists: boolean,
 *                  hasErrors: boolean,
 *                  file: string,
 *                  errorsCount: number
 *                }
 *               ]
 *              }
 *           }} Summary
 */

/**
 * This function returns a summary from the validator's response stripping out the notices.
 * 
 * @param validationResult from the GBFS validator class
 * @returns { Summary }
 */
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

  /**
   * call the callback function with {@link Summary}
   */
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
