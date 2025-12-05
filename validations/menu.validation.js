const Joi = require("joi");

const validateCreate = async (req, res, next) => {
  const schema = Joi.object({
    sort_order_no: Joi.number().required(),
    menuType: Joi.string().min(2).max(50).required(),
    menuName: Joi.string().min(2).max(100).required(),
    menuURL: Joi.string().allow("").optional(),
    metaTitle: Joi.string().min(2).max(500).required(),
    metakeyword: Joi.string().min(2).max(500).required(),
    metaDescription: Joi.string().allow("").optional(),
    parentId: Joi.string().min(24).max(24).allow(null),
    cmsId: Joi.string().min(24).max(24).allow(null),
    brandId: Joi.string().min(24).max(24).allow(null),
    categoryId: Joi.string().min(24).max(24).allow(null),
    isActive: Joi.boolean().optional(),
    showInHeader: Joi.boolean().optional(),
    showInFooter: Joi.boolean().optional(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message, isSuccess: false });
  }
  next();
};

const validateUpdate = async (req, res, next) => {
  const schema = Joi.object({
    menu_id: Joi.string().min(24).max(24).required(),
    sort_order_no: Joi.number().required(),
    menuType: Joi.string().min(2).max(50).required(),
    menuName: Joi.string().min(2).max(100).required(),
    menuURL: Joi.string().allow("").optional(),
    metaTitle: Joi.string().min(2).max(500).required(),
    metakeyword: Joi.string().min(2).max(500).required(),
    metaDescription: Joi.string().allow("").optional(),
    parentId: Joi.string().min(24).max(24).allow(null),
    cmsId: Joi.string().min(24).max(24).allow(null),
    brandId: Joi.string().min(24).max(24).allow(null),
    categoryId: Joi.string().min(24).max(24).allow(null),
    isActive: Joi.boolean().optional(),
    showInHeader: Joi.boolean().optional(),
    showInFooter: Joi.boolean().optional(),
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
