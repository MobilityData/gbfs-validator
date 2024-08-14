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
 *                  errorsCount: number,
 *                  groupedErrors: [
 *                    {
 *                      keyword: string,
 *                      message: string,
 *                      schemaPath: string,
 *                      count: number
 *                    }
 *                  ]
 *                }
 *               ]
 *              }
 *           }} Summary
 */

/**
 * This function returns a summary from the validator's response, stripping out the notices and grouping errors by message, keyword, and schemaPath.
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
      errorsCount: item.errorsCount,
      groupedErrors: item.exists && item.languages && item.languages[0] && item.languages[0].errors
        ? groupErrors(item.languages[0].errors)
        : []
    }))
  }
)

/**
 * Groups errors by keyword, message, and schemaPath, adding a count for each group.
 *
 * @param errors array of error objects
 * @returns {Array} grouped errors with count
 */
const groupErrors = (errors) => {
  const errorMap = {};

  errors.forEach(error => {
    const key = `${error.keyword}-${error.message}-${error.schemaPath}`;
    if (errorMap[key]) {
      errorMap[key].count += 1;
    } else {
      errorMap[key] = {
        keyword: error.keyword,
        message: error.message,
        schemaPath: error.schemaPath,
        count: 1
      };
    }
  });

  return Object.values(errorMap);
};


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
