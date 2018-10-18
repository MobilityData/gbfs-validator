const validate = require("./validate");
const systemPricingPlansSchema = require("../schema/systemPricingPlans");

module.exports = function validation(object) {
  return validate(systemPricingPlansSchema, object);
};
