const Joi = require("joi");

const validateCreate = async (req, res, next) => {
  const schema = Joi.object({
    sort_order_no: Joi.number().required(),
    menuId: Joi.string().min(24).max(24).required(),
    brandName: Joi.string().required(),
    subtitle: Joi.string().allow("").optional(),
    bannerTitle: Joi.string().allow("").optional(),
    metaTitle: Joi.string().allow("").optional(),
    metaKeyword: Joi.string().allow("").optional(),
    metaDescription: Joi.string().allow("").optional(),
    slug: Joi.string().allow("").optional(),
    showInHomePage: Joi.boolean().optional(),
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
    brand_id: Joi.string().required(),
    sort_order_no: Joi.number().required(),
    menuId: Joi.string().min(24).max(24).required(),
    brandName: Joi.string().required(),
    subtitle: Joi.string().allow("").optional(),
    bannerTitle: Joi.string().allow("").optional(),
    metaTitle: Joi.string().allow("").optional(),
    metaKeyword: Joi.string().allow("").optional(),
    metaDescription: Joi.string().allow("").optional(),
    slug: Joi.string().allow("").optional(),
    showInHomePage: Joi.boolean().optional(),
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
