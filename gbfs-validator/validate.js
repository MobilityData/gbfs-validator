const Ajv = require('ajv')
const addFormats = require('ajv-formats')
const mergePatch = require('ajv-merge-patch')

module.exports = function validate(schema, object, options = {}) {
  const ajv = new Ajv({ allErrors: true, strict: false })
  addFormats(ajv)
  mergePatch(ajv)

  let validate = options.addSchema
    ? ajv.addSchema(schema).compile(options.addSchema)
    : ajv.compile(schema)

  const valid = validate(object)
  // console.log(object, valid, validate.errors)
  return valid ? false : validate.errors
}
