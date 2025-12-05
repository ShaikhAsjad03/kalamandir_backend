const Joi = require("joi");

const validateCreate = async (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    contactNo: Joi.string()
      .pattern(/^\d{10}$/)
      .required(),
    subject: Joi.string().required(),
    comments: Joi.string().required(),
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
