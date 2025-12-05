const contactSchema = require("../models/contact.model");
const productInquirySchema = require("../models/productInquiry.model");
const newsLetterSchema = require("../models/newsLetter.model");

exports.dashboardStats = async (req, res, next) => {
  try {
    const totalContacts = await contactSchema.countDocuments();
    const totalProductInquiry = await productInquirySchema.countDocuments();
    const totalNewsLetters = await newsLetterSchema.countDocuments();

    const data = {
      totalContacts,
      totalProductInquiry,
      totalNewsLetters,
    };

    return res.status(200).json({
      isSuccess: true,
      message: "Dashboard stats fetched successfully.",
      data,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

exports.inquiryData = async (req, res, next) => {
  try {
    const productInquiries = await productInquirySchema
      .find()
      .sort({ createdAt: -1 })
      .limit(10);

    const contactInqiuires = await contactSchema
      .find()
      .sort({ createdAt: -1 })
      .limit(10);

    const inquiries = {
      productInquiries,
      contactInqiuires,
    };

    return res.status(200).json({
      isSucess: true,
      message: "Inquiries fetched successfuly.",
      inquiries,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};
