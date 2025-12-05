const joi = require("joi");

const settingsValidator = async (req, res, next) => {
  const schema = joi.object({
    companyName: joi.string().allow("").required().label("Company Name"),
    description: joi.string().allow("").required().label("Description"),
    socialMedia: joi.any().required().label("Social Media"),
    emailInfo: joi.string().email().allow("").required().label("Info Email"),
    emailSupport: joi
      .string()
      .email()
      .allow("")
      .optional()
      .label("Support Email"),
    whatsappNo: joi.string().allow("").required().label("WhatsApp Number"),
    collection_title: joi.string().optional().label("Collection Title"),
    contact: joi.string().allow("").optional().label("Contact"),
    instagramFeedType: joi
      .string()
      .valid("Image", "Video", "All")
      .label("Instagram Feed Type"),
    instagramActive: joi.boolean().label("Instagram Active"),
    footerBackgroundImage: joi
      .any()
      .optional()
      .label("Footer Background Image"),
    footerTextColor: joi.string().optional().label("Footer Text Color"),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.message, isSuccess: false });
  } else {
    next();
  }
};

module.exports = {
  settingsValidator,
};
