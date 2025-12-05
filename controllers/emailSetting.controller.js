const emailSettingsSchema = require("../models/emailSettings.model");

exports.updateEmailSettings = async (req, res) => {
  try {
    const {
      email,
      password,
      host,
      port,
      fromEmail,
      bccEmail,
      ccEmail,
      newsLetterSubject,
      newsLetterTemplate,
      fromEmailContact,
      bccEmailContact,
      ccEmailContact,
      contactSubject,
      contactTemplate,
      fromEmailProductInquiry,
      bccEmailProductInquiry,
      ccEmailProductInquiry,
      productInquirySubject,
      productInquiryTemplate,
    } = req.body;

    const findData = await emailSettingsSchema.findOne();

    if (findData) {
      let updatedData = {};
      updatedData["email"] = email;
      updatedData["password"] = password;
      updatedData["host"] = host;
      updatedData["port"] = port;
      updatedData["fromEmailNews"] = fromEmail;
      updatedData["bccEmail"] = bccEmail;
      updatedData["ccEmail"] = ccEmail;
      updatedData["newsLetterSubject"] = newsLetterSubject;
      updatedData["newsLetterTemplate"] = newsLetterTemplate;
      updatedData["fromEmailContact"] = fromEmailContact;
      updatedData["bccEmailContact"] = bccEmailContact;
      updatedData["ccEmailContact"] = ccEmailContact;
      updatedData["contactSubject"] = contactSubject;
      updatedData["contactTemplate"] = contactTemplate;
      updatedData["fromEmailProductInquiry"] = fromEmailProductInquiry;
      updatedData["bccEmailProductInquiry"] = bccEmailProductInquiry;
      updatedData["ccEmailProductInquiry"] = ccEmailProductInquiry;
      updatedData["productInquirySubject"] = productInquirySubject;
      updatedData["productInquiryTemplate"] = productInquiryTemplate;

      await emailSettingsSchema
        .findByIdAndUpdate(findData.id, updatedData, { new: true })
        .then((setting) => {
          return res.status(200).send({
            data: setting,
            message: "Email settings updated successfully.",
            isSuccess: true,
          });
        })
        .catch((error) => {
          return res.status(500).send({
            message: error.message,
            isSuccess: false,
          });
        });
    } else {
      const settingData = new emailSettingsSchema({
        email,
        password,
        host,
        port,
        fromEmail,
        bccEmail,
        ccEmail,
        newsLetterSubject,
        newsLetterTemplate,
        fromEmailContact,
        bccEmailContact,
        ccEmailContact,
        contactSubject,
        contactTemplate,
        fromEmailProductInquiry,
        bccEmailProductInquiry,
        ccEmailProductInquiry,
        productInquirySubject,
        productInquiryTemplate,
      });
      await settingData
        .save()
        .then((setting) => {
          return res.status(200).send({
            data: setting,
            message: "Email settings updated successfully.",
            isSuccess: true,
          });
        })
        .catch((error) => {
          return res.status(500).send({
            message: error.message,
            isSuccess: false,
          });
        });
    }
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

exports.getEmailSettings = async (req, res) => {
  await emailSettingsSchema
    .findOne()
    .then(async (data) => {
      return res.status(200).send({
        data: data,
        isSuccess: true,
        message: "Get Email settings successfully.",
      });
    })
    .catch((error) => {
      return res.status(500).send({
        message: error.message,
        isSuccess: false,
      });
    });
};
