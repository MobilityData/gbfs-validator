const Ajv = require('ajv')
const addFormats = require('ajv-formats')

module.exports = function validate(schema, object) {
  const ajv = new Ajv({ allErrors: true })
  addFormats(ajv)

  const validate = ajv.compile(schema)
  const valid = validate(object)
  // console.log(object, valid, validate.errors)
  return valid ? false : validate.errors
}
