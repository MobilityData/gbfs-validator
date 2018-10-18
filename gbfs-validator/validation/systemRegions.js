const validate = require("./validate");
const systemRegionsSchema = require("../schema/systemRegions");

module.exports = function validation(object) {
  return validate(systemRegionsSchema, object);
};
