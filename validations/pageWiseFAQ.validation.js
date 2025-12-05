const Joi = require("joi");

const validateCreate = async (req, res, next) => {
  const schema = Joi.object({
    sort_order_no: Joi.number().required(),
    slug: Joi.string().optional(),
    page_name: Joi.string().required(),
    faqQuestion: Joi.string().required(),
    faqAnswer: Joi.string().optional().allow(""),
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
    pageWiseFaq_id: Joi.string().min(24).max(24).required(),
    sort_order_no: Joi.number().required(),
    page_name: Joi.string().required(),
    faqQuestion: Joi.string().required(),
    faqAnswer: Joi.string().optional().allow(""),
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
