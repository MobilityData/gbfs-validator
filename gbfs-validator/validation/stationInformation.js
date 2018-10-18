const validate = require("./validate");
const stationInformationSchema = require("../schema/stationInformation");

module.exports = function validation(object) {
  return validate(stationInformationSchema, object);
};
