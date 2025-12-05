const contactSchema = require("../models/contact.model");
const emailSettingsSchema = require("../models/emailSettings.model");
const { sendMail } = require("../helpers/mail");

exports.createApi = async (req, res) => {
  try {
    const { firstName, lastName, email, contactNo, subject, comments } =
      req.body;

    const createObj = {
      firstName,
      lastName,
      email,
      contactNo,
      subject,
      comments,
    };

    const saveData = await contactSchema(createObj);
    await saveData.save();

    const getEmailData = await emailSettingsSchema.findOne();
    if (!getEmailData) {
      return res.status(400).send({
        isSuccess: false,
        message: "Email settings not configured.",
      });
    }

    const {
      fromEmailContact,
      ccEmailContact,
      bccEmailContact,
      contactSubject,
      contactTemplate,
    } = getEmailData;

    if (!contactTemplate) {
      return res.status(400).send({
        isSuccess: false,
        message: "Contact template not found in email settings.",
      });
    }

    let finalTemplate = contactTemplate;
    finalTemplate = finalTemplate.replace(/\[FIRSTNAME\]/g, firstName || "");
    finalTemplate = finalTemplate.replace(/\[LASTNAME\]/g, lastName || "");
    finalTemplate = finalTemplate.replace(/\[EMAIL\]/g, email || "");
    finalTemplate = finalTemplate.replace(/\[CONTACT\]/g, contactNo || "");
    finalTemplate = finalTemplate.replace(/\[SUBJECT\]/g, subject || "");
    finalTemplate = finalTemplate.replace(/\[ENQUIRYTYPE\]/g, comments || "");

    await sendMail(
      fromEmailContact,
      contactSubject,
      finalTemplate,
      ccEmailContact,
      bccEmailContact
    );

    return res.status(200).send({
      isSuccess: true,
      message:
        "Thank you for reaching out to us! We’ve received your enquiry and will get back to you as quickly as possible.",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

exports.getAllApis = async (req, res) => {
  try {
    const getData = await contactSchema.find().sort({ createdAt: -1 });
    return res.status(200).send({
      isSuccess: true,
      message: "Enquiries listed successfully.",
      data: getData,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

exports.getDataById = async (req, res) => {
  try {
    const contact_id = req.body.contact_id;
    const getData = await contactSchema.findById(contact_id);
    return res.status(200).send({
      isSuccess: true,
      message: "Get Enquiry successfully.",
      data: getData,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

exports.deleteApi = async (req, res) => {
  try {
    const contact_id = req.body.contact_id;
    await contactSchema
      .findByIdAndDelete(contact_id)
      .then(async (data) => {
        if (!data) {
          return res.status(404).send({
            message: "Enquiry with this id not found!",
            isSuccess: false,
          });
        }
        return res.status(200).send({
          isSuccess: true,
          message: "Enquiry deleted successfully.",
        });
      })
      .catch((error) => {
        return res.status(500).send({
          message: error.message,
          isSuccess: false,
        });
      });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

exports.getPaginationData = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.body;
    page = parseInt(page);
    limit = parseInt(limit);
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;
    const skip = (page - 1) * limit;
    const getData = await contactSchema
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalRecords = await contactSchema.countDocuments();
    return res.status(200).send({
      isSuccess: true,
      currentPageNo: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      message: "Enquiries listed successfully.",
      data: getData,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};
