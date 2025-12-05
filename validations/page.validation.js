const Joi = require("joi");

const validateCreate = async (req, res, next) => {
  const schema = Joi.object({
    pageName: Joi.string().required(),
    isActive: Joi.boolean().optional(),
    action: Joi.array(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message, isSuccess: false });
  }
  next();
};

// const pageActionValidate = async (req, res, next) => {
//   const schema = Joi.object({
//      pageId: Joi.string().required(),
//     actionType: Joi.string().required(),
//     isActive: Joi.boolean().optional(),
//   });
//   const { error } = schema.validate(req.body);
//   if (error) {
//     return res.status(400).json({ message: error.message, isSuccess: false });
//   }
//   next();
// };

module.exports = {
  validateCreate,
  // pageActionValidate
};
