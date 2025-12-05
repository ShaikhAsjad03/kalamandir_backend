const Joi = require("joi");

const validateCreate = async (req, res, next) => {
  const schema = Joi.object({
    sort_order_no: Joi.number().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    image:Joi.optional(),
    // image: Joi.string().optional(),
    url: Joi.string().required(),
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
    sort_order_no: Joi.number().required(),
    city: Joi.string().optional().allow(""),
    state: Joi.string().optional().allow(""),
    image: Joi.string().optional().allow(""),
    url: Joi.string().optional(),
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
