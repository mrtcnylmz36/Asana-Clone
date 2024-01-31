const joi = require("joi");

const createValidation = joi.object({
  title: joi.string().required().min(3),
  section_id: joi.string().required().min(8),
  user_id: joi.string().min(8),
  description: joi.string().min(8),
  assigned_to: joi.string().min(8),
  due_date: joi.date(),
  statuses: joi.array(),

  order: joi.number(),
  isCompleted: joi.boolean(),
  comments: joi.array(),
  media: joi.array(),
  sub_tasks: joi.array(),
});

const updateValidation = joi.object({
  title: joi.string().min(3),
  section_id: joi.string().min(8),
  user_id: joi.string().min(8),
  description: joi.string().min(8),
  assigned_to: joi.string().min(8),
  due_date: joi.date(),
  statuses: joi.array(),

  order: joi.number(),
  isCompleted: joi.boolean(),
  comments: joi.array(),
  media: joi.array(),
  sub_tasks: joi.array(),
});

const commentValidation = joi.object({
  comment: joi.string().min(3),
  _id: joi.string().min(8),
  _destroy: joi.boolean(),
});

module.exports = {
  createValidation,
  updateValidation,
  commentValidation,
};
