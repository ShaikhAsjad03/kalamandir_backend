const joi = require("joi");

const createApi = async (req, res, next) => {
  const schema = joi.object({
    fullName: joi.string().min(2).max(100).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    userType: joi.string().required().error(new Error("Invalid usertype ID!")),
    mobileNo: joi
      .string()
      .pattern(/^[0-9]{10}$/)
      .required()
      .messages({
        "string.empty": "Mobile number is required",
        "string.pattern.base": "Mobile number must be 10 digits",
      }),

    whatsappNo: joi
      .string()
      .pattern(/^[0-9]{10}$/)
      .allow("", null)
      .messages({
        "string.pattern.base": "WhatsApp number must be 10 digits",
      }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.message, isSuccess: false });
  } else {
    next();
  }
};


const updateApi = async (req, res, next) => {
  const schema = joi.object({
    admin_id: joi.string().min(24).max(24),
    fullName: joi.string().min(2).max(100).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    userType: joi.objectId(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.message, isSuccess: false });
  } else {
    next();
  }
};

const updateStatus = async (req, res, next) => {
  const schema = joi.object({
    isActive: joi.boolean().required(),
    modelName: joi.string().required(),
    fieldId: joi.string().optional().min(24).max(24),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.message, isSuccess: false });
  } else {
    next();
  }
};

const login = async (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.message, isSuccess: false });
  } else {
    next();
  }
};

module.exports = {
  createApi,
  updateApi,
  updateStatus,
  login,
};
