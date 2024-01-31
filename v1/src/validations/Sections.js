const joi = require("joi");

const createValidation = joi.object({
  name: joi.string().required().min(3),
  project_id: joi.string().required().min(8),
});

const updateValidation = joi.object({
  name: joi.string().min(3),
  project_id: joi.string().min(8),
});

module.exports = {
  createValidation,
  updateValidation,
};
