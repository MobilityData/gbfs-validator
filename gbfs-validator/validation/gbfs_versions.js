const validate = require('./validate')
const gbfsVersionsSchema = require('../schema/gbfs_versions.json')

module.exports = function validation(object) {
  return validate(gbfsVersionsSchema, object)
}
