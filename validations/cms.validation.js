const Joi = require("joi");

const validateCreate = async (req, res, next) => {
  const schema = Joi.object({
    sort_order_no: Joi.number().required(),
    page_title: Joi.string().min(2).max(50).required(),
    page_subtitle: Joi.string().min(2).max(200).allow("").optional(),
    page_editor: Joi.string().allow("").optional(),
    isActive: Joi.boolean().optional(),
    images: Joi.array().items(Joi.string()).optional(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message, isSuccess: false });
  }
  next();
};

const validateUpdate = async (req, res, next) => {
  const schema = Joi.object({
    cms_id: Joi.string().min(24).max(24).required(),
    sort_order_no: Joi.number().required(),
    page_title: Joi.string().min(2).max(50).required(),
    page_subtitle: Joi.string().min(2).max(200).allow("").optional(),
    page_editor: Joi.string().allow("").optional(),
    isActive: Joi.boolean().optional(),
    images: Joi.array().items(Joi.string()).optional(),
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
