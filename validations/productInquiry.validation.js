const Joi = require("joi");

const validateCreate = async (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string().min(2).required(),
    productName: Joi.string().min(2).required(),
    productCode: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    mobileNo: Joi.string()
      .pattern(/^\d{10}$/)
      .required(),
    inquiry: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message, isSuccess: false });
  }
  next();
};

module.exports = {
  validateCreate,
};
