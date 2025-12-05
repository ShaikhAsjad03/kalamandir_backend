const newsLetterSchema = require("../models/newsLetter.model");
const emailSettingsSchema = require("../models/emailSettings.model");
const { sendMail } = require("../helpers/mail");

exports.createApi = async (req, res) => {
  try {
    const { email, whatsAppNo } = req.body;
    const existingUser = await newsLetterSchema.findOne({ email });
    if (existingUser) {
      return res.status(400).send({
        isSuccess: false,
        message:
          "You already subscribed to our newsletter.",
      });
    }

    const createObj = { email, whatsAppNo };
    const saveData = new newsLetterSchema(createObj);
    await saveData.save();

    const getEmailData = await emailSettingsSchema.findOne();
    if (!getEmailData) {
      return res.status(400).send({
        isSuccess: false,
        message: "Email settings not configured.",
      });
    }

    const {
      fromEmail,
      ccEmail,
      bccEmail,
      newsLetterSubject,
      newsLetterTemplate,
    } = getEmailData;

    if (!newsLetterTemplate) {
      return res.status(400).send({
        isSuccess: false,
        message: "News letter template not found in email settings.",
      });
    }

    let finalTemplate = newsLetterTemplate
      .replace(/\[EMAIL\]/g, email || "")
      .replace(/\[WHATSAPPNO\]/g, whatsAppNo || "")
    await sendMail(
      email,
      newsLetterSubject,
      finalTemplate,
      ccEmail,
      bccEmail
    );

    return res.status(200).send({
      isSuccess: true,
      message:
        "Thank you for subscribing to our newsletter! You'll now receive the latest updates, offers, and news directly in your inbox.",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).send({
        isSuccess: false,
        message: "This email is already subscribed.",
      });
    }

    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};


exports.getAllApis = async (req, res) => {
  try {
    const getData = await newsLetterSchema.find().sort({ createdAt: -1 });
    return res.status(200).send({
      isSuccess: true,
      message: "Newsletters listed successfully.",
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
    const newsletter_id = req.body.newsletter_id;
    const getData = await newsLetterSchema.findById(newsletter_id);
    return res.status(200).send({
      isSuccess: true,
      message: "Get Newsletter successfully.",
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
    const newsletter_id = req.body.newsletter_id;
    await newsLetterSchema
      .findByIdAndDelete(newsletter_id)
      .then(async (data) => {
        if (!data) {
          return res.status(404).send({
            message: "Newsletter with this id not found!",
            isSuccess: false,
          });
        }
        return res.status(200).send({
          isSuccess: true,
          message: "Newsletter deleted successfully.",
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
    const getData = await newsLetterSchema
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalRecords = await newsLetterSchema.countDocuments();
    return res.status(200).send({
      isSuccess: true,
      currentPageNo: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      message: "Newsletters listed successfully.",
      data: getData,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};
