const Joi = require("joi");

const validateCreate = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    type:Joi.string().required(),
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
};
