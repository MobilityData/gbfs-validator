const validate = require("./validate");
const freeBikeStatusSchema = require("../schema/freeBikeStatus");

module.exports = function validation(object) {
  return validate(freeBikeStatusSchema, object);
};
