const productInquirySchema = require("../models/productInquiry.model");
const emailSettingsSchema = require("../models/emailSettings.model");
const { sendMail } = require("../helpers/mail");
const productSchema = require("../models/product.model");

exports.createApi = async (req, res) => {
  try {
    const { productName, productCode, fullName, email, mobileNo, inquiry } =
      req.body;

       const product = await productSchema.findOne({ productCode }).select("productImage productName");
       const productImage =`${process.env.BASE_URL}${product.productImage}`
      
    const createObj = {
      productName,
      productCode,
      fullName,
      email,
      mobileNo,
      inquiry,
    };
    

    const saveData = await productInquirySchema(createObj);
    await saveData.save();

    const getEmailData = await emailSettingsSchema.findOne();
    if (!getEmailData) {
      return res.status(400).send({
        isSuccess: false,
        message: "Email settings not configured.",
      });
    }

    const {
      fromEmailProductInquiry,
      bccEmailProductInquiry,
      ccEmailProductInquiry,
      productInquirySubject,
      productInquiryTemplate,
    } = getEmailData;

    if (!productInquiryTemplate) {
      return res.status(400).send({
        isSuccess: false,
        message: "Contact template not found in email settings.",
      });
    }

    
    let finalTemplate = productInquiryTemplate;
    finalTemplate = finalTemplate.replace(/\[PRODUCTNAME\]/g, productName || "");
    finalTemplate = finalTemplate.replace(/\[PRODUCTCODE\]/g, productCode || "");
    finalTemplate = finalTemplate.replace(/\[PRODUCTIMAGE\]/g, productImage || "");
    finalTemplate = finalTemplate.replace(/\[FULLNAME\]/g, fullName || "");
    finalTemplate = finalTemplate.replace(/\[EMAIL\]/g, email || "");
    finalTemplate = finalTemplate.replace(/\[CONTACT\]/g, mobileNo || "");
    finalTemplate = finalTemplate.replace(/\[MESSAGE\]/g, inquiry || "");
    finalTemplate = finalTemplate.replace(/\[PRODUCTLINK\]/g, productCode || "");

    await sendMail(
      email,
      productInquirySubject,
      finalTemplate,
      ccEmailProductInquiry,
      bccEmailProductInquiry,
    );
    return res.status(200).send({
      isSuccess: true,
      message:
        "Thank you for your interest in our product! Our team has received your inquiry and will get back to you with more details shortly.",
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
    const getData = await productInquirySchema.find().sort({ createdAt: -1 });
    return res.status(200).send({
      isSuccess: true,
      message: "Product Enquiries listed successfully.",
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
    const getData = await productInquirySchema.findById(contact_id);
    return res.status(200).send({
      isSuccess: true,
      message: "Get Product Enquiry successfully.",
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
    await productInquirySchema
      .findByIdAndDelete(contact_id)
      .then(async (data) => {
        if (!data) {
          return res.status(404).send({
            message: "Product Enquiry with this id not found!",
            isSuccess: false,
          });
        }
        return res.status(200).send({
          isSuccess: true,
          message: "Product Enquiry deleted successfully.",
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
    const getData = await productInquirySchema
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalRecords = await productInquirySchema.countDocuments();
    return res.status(200).send({
      isSuccess: true,
      currentPageNo: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      message: "Product Enquiries listed successfully.",
      data: getData,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};
