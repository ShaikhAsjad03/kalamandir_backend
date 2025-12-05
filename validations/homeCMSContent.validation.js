const Joi = require("joi");

const validateCreate = async (req, res, next) => {
  const schema = Joi.object({
    sort_order_no: Joi.number().required(),
    title: Joi.string().required(),
    slug: Joi.string().optional().allow(""),
    page_name: Joi.string().required(),
    description: Joi.string().optional().allow(""),
    images: Joi.array().items(Joi.string()).optional(),
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
    pageContent_id: Joi.string().min(24).max(24).required(),
    sort_order_no: Joi.number().required(),
    slug: Joi.string().optional().allow(""),
    page_name: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().optional().allow(""),
    images: Joi.array().items(Joi.string()).optional(),
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
