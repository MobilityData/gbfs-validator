const validate = require("./validate");
const systemAlertsSchema = require("../schema/systemAlerts");

module.exports = function validation(object) {
  return validate(systemAlertsSchema, object);
};
