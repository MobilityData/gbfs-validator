const validate = require("./validate");
const systemInformationSchema = require("../schema/systemInformation");

module.exports = function validation(object) {
  return validate(systemInformationSchema, object);
};
