const Joi = require("joi");

const validateCreate = async (req, res, next) => {
  const schema = Joi.object({
    _id: Joi.string().optional().min(24).max(24),
    date: Joi.date().required(),
    rate18K: Joi.string().required(),
    rate22K: Joi.string().required(),
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
    gold_rate_id: Joi.string().min(24).max(24).required(),
    date: Joi.date().required(),
    rate18K: Joi.string().required(),
    rate22K: Joi.string().required(),
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
