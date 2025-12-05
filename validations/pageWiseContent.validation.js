const Joi = require("joi");

const validateCreate = async (req, res, next) => {
  const schema = Joi.object({
    slug: Joi.string().optional().allow(""),
    page_name: Joi.string().min(24).max(24).required(),
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
    pageWise_id: Joi.string().min(24).max(24).required(),
    page_name: Joi.string().min(24).max(24).required(),
    description: Joi.string().optional().allow(""),
    images: Joi.array().items(Joi.string()).optional(),
    isActive: Joi.boolean().optional(),
    slug: Joi.string().optional(),
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
