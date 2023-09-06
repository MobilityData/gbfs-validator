const Ajv = require('ajv')
const ajvErrors = require('ajv-errors')
const addFormats = require('ajv-formats')

/**
 * Update the schema to check for additionalProperties errors
 */
function addAdditionalPropertiesErrors(sub_schema) {
  if (sub_schema.type === 'object' && sub_schema.properties) {
    let additionalProperties
    if (sub_schema.additionalProperties) {
      // Additional properties are allowed
      additionalProperties = true
    } else if (sub_schema.additionalProperties === false) {
      // Additional properties are already reported as error, we ignore them
      additionalProperties = true
    } else {
      // Additional properties will be reported as error by ajv, and we will report them as warnings
      additionalProperties = false
    }

    const res = {
      additionalProperties,
      properties: {},
      patternProperties: {
        '^_': {} // Properties starting with _ are ignored
      }
    }

    for (const [key, value] of Object.entries(sub_schema.properties)) {
      res.properties[key] = addAdditionalPropertiesErrors(value)
    }

    return res
  } else if (sub_schema.type === 'array' && sub_schema.items) {
    return {
      type: 'array',
      items: addAdditionalPropertiesErrors(sub_schema.items)
    }
  } else {
    return {} // Remove all validations
  }
}

function checkAdditionalProperties({ warnings, data, schema }) {
  let duplicateSchema = JSON.parse(JSON.stringify(schema))

  duplicateSchema = addAdditionalPropertiesErrors(duplicateSchema)

  const ajv = new Ajv({ allErrors: true, strict: false })
  ajvErrors(ajv)
  addFormats(ajv)

  const validate = ajv.compile(duplicateSchema)

  const valid = validate(data)

  if (!valid) {
    warnings.push(
      ...validate.errors
        .filter((e) => e.keyword === 'additionalProperties')
        .map((e) => ({
          path: e.schemaPath.replace(/\/additionalProperties$/, ''),
          key: 'additional_properties',
          message: `Additional property detected.`,
          additionalProperty: e.params.additionalProperty
        }))
    )
  }
}

module.exports = { checkAdditionalProperties }
