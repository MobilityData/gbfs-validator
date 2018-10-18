const Avj = require("ajv");

module.exports = function validate(schema, object) {
  const avj = new Avj({ allErrors: true });
  const validate = avj.compile(schema);
  const valid = validate(object);
  //   console.log(object, valid, validate.errors);
  return valid ? false : validate.errors;
};
