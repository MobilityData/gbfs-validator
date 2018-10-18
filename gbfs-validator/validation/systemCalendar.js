const validate = require("./validate");
const systemCalendarSchema = require("../schema/systemCalendar");

module.exports = function validation(object) {
  return validate(systemCalendarSchema, object);
};
