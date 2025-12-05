const Joi = require("joi");

const validateCreate = async (req, res, next) => {
  const schema = Joi.object({
    sort_order_no: Joi.number().required(),
    title: Joi.string().required(),
    link: Joi.string().optional().allow(""),
    linkText: Joi.string().optional().allow(""),
    description: Joi.string().optional().allow(""),
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
    scheme_id: Joi.string().min(24).max(24).required(),
    sort_order_no: Joi.number().required(),
    title: Joi.string().required(),
    link: Joi.string().optional().allow(""),
    linkText: Joi.string().optional().allow(""),
    description: Joi.string().optional().allow(""),
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
