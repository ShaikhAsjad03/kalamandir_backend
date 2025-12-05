const Joi = require("joi");

const validateCreate = async (req, res, next) => {
  const schema = Joi.object({
    productName: Joi.string().required(),
    productCode: Joi.string().required(),
    slug: Joi.string().required(),
    metal: Joi.string().min(24).max(24).allow("").optional(),
    gender: Joi.string().min(24).max(24).required(),
    categoryId: Joi.string().min(24).max(24).allow("").optional(),
    brandId: Joi.string().min(24).max(24).allow("").optional(),
    collection: Joi.string().min(24).max(24).allow("").optional(),
    subBrandId: Joi.string().min(24).max(24).allow("").optional(),
    productDescription: Joi.string().allow("").optional(),
    netWeight: Joi.number().allow("").optional(),
    grossWeight: Joi.number().allow("").optional(),
    diamondWeight: Joi.number().allow("").optional(),
    otherWeight: Joi.number().allow("").optional(),
    // price: Joi.number().allow("").optional(),
    mrp: Joi.number().allow("").optional(),
    approxMrp: Joi.number().allow("").optional(),
    dailyGoldRate: Joi.number().allow("").optional(),
    stone: Joi.string().min(24).max(24).allow("").optional(),
    metaTitle: Joi.string().allow("").optional(),
    metaDescription: Joi.string().allow("").optional(),
    metaKeywords: Joi.string().allow("").optional(),
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
    collection_id: Joi.string().min(24).max(24).required(),
    productName: Joi.string().required(),
    productCode: Joi.string().required(),
    slug: Joi.string().required(),
    metal: Joi.string().min(24).max(24).allow("").optional(),
    categoryId: Joi.string().min(24).max(24).allow("").optional(),
    brandId: Joi.string().min(24).max(24).allow("").optional(),
    collection: Joi.string().min(24).max(24).allow("").optional(),
    subBrandId: Joi.string().min(24).max(24).allow("").optional(),
    productDescription: Joi.string().allow("").optional(),
    netWeight: Joi.number().required(),
    grossWeight: Joi.number().allow("").optional(),
    diamondWeight: Joi.number().allow("").optional(),
    otherWeight: Joi.number().allow("").optional(),
    // price: Joi.number().allow("").optional(),
    mrp: Joi.number().allow("").optional(),
    approxMrp: Joi.number().allow("").optional(),
    dailyGoldRate: Joi.number().allow("").optional(),
    stone: Joi.string().min(24).max(24).allow("").optional(),
    metaTitle: Joi.string().allow("").optional(),
    metaDescription: Joi.string().allow("").optional(),
    metaKeywords: Joi.string().allow("").optional(),
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
