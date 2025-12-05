const joi = require("joi");

const emailSettingsValidator = async (req, res, next) => {
  const schema = joi.object({
    email: joi.string().allow("").required(),
    password: joi.string().allow("").required(),
    host: joi.string().allow("").required(),
    port: joi.number().allow("").required(),
    fromEmail: joi.string().allow("").optional(),
    bccEmail: joi.string().allow("").optional(),
    ccEmail: joi.string().allow("").optional(),
    newsLetterSubject: joi.string().allow("").optional(),
    newsLetterTemplate: joi.string().allow("").optional(),
    fromEmailContact: joi.string().allow("").optional(),
    bccEmailContact: joi.string().allow("").optional(),
    ccEmailContact: joi.string().allow("").optional(),
    contactSubject: joi.string().allow("").optional(),
    contactTemplate: joi.string().allow("").optional(),
    fromEmailProductInquiry: joi.string().allow("").optional(),
    bccEmailProductInquiry: joi.string().allow("").optional(),
    ccEmailProductInquiry: joi.string().allow("").optional(),
    productInquirySubject: joi.string().allow("").optional(),
    productInquiryTemplate: joi.string().allow("").optional(),
  });
  
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.message, isSuccess: false });
  } else {
    next();
  }
};

module.exports = {
  emailSettingsValidator,
};
