const validate = require('./validate')
const gbfsSchema = require('../schema/gbfs')

module.exports = function validation (object) {
  return validate(gbfsSchema, object)
}
