const Joi = require("joi");

const bannerTopValidate = async (req, res, next) => {
  const schema = Joi.object({
    sort_order_no: Joi.number().required(),
    link: Joi.string().optional().allow(""),
    banner_id:Joi.string().optional().allow(""),
    bannerType:Joi.string().optional().allow(""),
    isActive: Joi.boolean().optional(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message, isSuccess: false });
  }
  next();
};


module.exports = {
  bannerTopValidate,
};
