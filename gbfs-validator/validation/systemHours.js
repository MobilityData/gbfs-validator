const validate = require("./validate");
const systemHoursSchema = require("../schema/systemHours");

module.exports = function validation(object) {
  return validate(systemHoursSchema, object);
};
