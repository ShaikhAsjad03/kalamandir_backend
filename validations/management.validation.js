const Joi = require("joi");

const validateCreate = async (req, res, next) => {
  const schema = Joi.object({
    sort_order_no: Joi.number().required(),
    group: Joi.string().required(),
    name: Joi.string().min(2).max(20).required(),
    designation: Joi.string().required(),
    introduction: Joi.string().allow("").optional(),
    isActive: Joi.boolean().optional(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message, isSuccess: false });
  }
  next();
};

const validateUpdate = async (req, res, next) => {
  const schema = Joi.object({
    team_id: Joi.string().min(24).max(24).required(),
    sort_order_no: Joi.number().required(),
    group: Joi.string().required(),
    name: Joi.string().min(2).max(20).required(),
    designation: Joi.string().required(),
    introduction: Joi.string().allow("").optional(),
    isActive: Joi.boolean().optional(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message, isSuccess: false });
  }
  next();
};

module.exports = {
  validateCreate,
  validateUpdate,
};
