const validate = require("./validate");
const stationStatusSchema = require("../schema/stationStatus");

module.exports = function validation(object) {
  return validate(stationStatusSchema, object);
};
