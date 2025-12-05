const adminSchema = require("../models/admin.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ejs = require("ejs");
const path = require("path");
const { sendMail } = require("../helpers/mail");
const videoSchema = require("../models/videos.model");
const schemesSchema = require("../models/schemes.model");
const homeSliderSchema = require("../models/homeBanner.model");
const menuSchema = require("../models/menu.model");
const bannerSchema = require("../models/banner.model");
const certificateSchema = require("../models/certificate.model");
const CmsSchema = require("../models/cms.model");
const pageContentSchema = require("../models/homeCMSContent.model");
const storeLocatorSchema = require("../models/storeLocator.model");
const testimonialsSchema = require("../models/testimonials.model");
const policiesSchema = require("../models/policies.model");
const disclousersSchema = require("../models/disclousers.model");
const boardAndCommitteesSchema = require("../models/boardAndCommitiees.model");
const categorySchema = require("../models/category.model");
const productSchema = require("../models/product.model");
const metalSchema = require("../models/metal.model");
const genderSchema = require("../models/gender.model");
const brandSchema = require("../models/brand.model");
// const pageWiseContentSchema = require("../models/pageWiseContent.model");
const pageWiseFaqSchema = require("../models/pageWiseFAQ.model");
const goldRateSchema = require("../models/goleRate.model");
const homeBannerTopModel = require("../models/homeBannerTop.model");
const pageModel = require("../models/page.model");
const userTypeSchema = require("../models/userType.model");
const PermissionModel = require("../models/Permission.model");
const cityModel = require("../models/city.model");
const eventSchema = require("../models/event.model");
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, userType, whatsappNo, mobileNo } =
      req.body;
    const findEmail = await adminSchema.findOne({ email });
    if (findEmail) {
      return res
        .status(409)
        .send({ message: "Email is already existing!", isSuccess: false });
    } else {
      const isExistingUserType = await userTypeSchema.findById(userType);
      if (!isExistingUserType)
        return res
          .status(404)
          .send({ message: "User type not found!", isSuccess: false });

      const Password = await bcrypt.hash(password, 10);
      const newAdmin = await adminSchema({
        fullName,
        email,
        password: Password,
        stringPassword: password,
        userType: userType,
        whatsappNo,
        mobileNo,
      });
      await newAdmin.save();
      return res.status(200).send({
        message: "Admin registration successfully.",
        isSuccess: true,
      });
    }
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const findEmail = await adminSchema
      .findOne({ email })
      .lean()
      .populate("userType", "_id name");
    if (!findEmail) {
      return res
        .status(404)
        .json({ message: "Invalid Credentials!", isSuccess: false });
    }
    const isMatch = await bcrypt.compare(password, findEmail.password);
    if (isMatch) {
      const authToken = jwt.sign(
        {
          id: findEmail._id,
          email,
        },
        process.env.ADMIN_TOKEN_KEY,
        { expiresIn: process.env.TOKEN_EXPIRE_TIME }
      );

      delete findEmail.stringPassword;
      delete findEmail.password;

      return res.status(200).json({
        isSuccess: true,
        message: "Login successfully.",
        authToken,
        admin: findEmail,
      });
    } else {
      return res
        .status(409)
        .json({ message: "Invalid Credentials!", isSuccess: false });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      isSuccess: false,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const { fullName, email, password, userType, mobileNo, whatsappNo } =
      req.body;
    const findAdmin = await adminSchema.findById(id);
    if (!findAdmin) {
      return res
        .status(404)
        .send({ message: "Admin not found!", isSuccess: false });
    }
    if (userType) {
      const isExistUserType = await userTypeSchema.findById(userType);
      if (!isExistUserType)
        return res
          .status(404)
          .send({ message: "User type not found!", isSuccess: false });
    }
    let hasPassword;
    if (password) {
      hasPassword = await bcrypt.hash(password, 10);
    }
    const updatedData = await adminSchema.findByIdAndUpdate(id, {
      fullName: fullName,
      email: email,
      password: hasPassword ? hasPassword : findAdmin.password,
      stringPassword: hasPassword ? password : findAdmin.stringPassword,
      userType: userType,
      mobileNo,
      whatsappNo,
    });
    return res
      .status(200)
      .send({ message: "Admin updated successfully.", isSuccess: true });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const findEmail = await adminSchema.findOne({ email });
    if (findEmail) {
      let otpCode = Math.floor(100000 + Math.random() * 900000);
      const mailBody = await ejs.renderFile(
        path.join(__dirname, "../views/forgot-password.ejs"),
        {
          otpCode: otpCode,
          email: findEmail.email,
          fullName: findEmail.fullName,
        }
      );
      await sendMail(email, "Admin Reset Password.", mailBody);
      let otpExpireIn = Date.now() + Number(process.env.OTP_VALID_TIME);
      await adminSchema
        .findByIdAndUpdate(findEmail._id, {
          otpCode: otpCode,
          otpExpireIn: otpExpireIn,
        })
        .then(() => {
          return res.status(200).send({
            message: "Otp is sent in your email.",
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
      return res
        .status(404)
        .send({ message: "Email not found!", isSuccess: false });
    }
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otpCode } = req.body;
    await adminSchema.findOne({ email }).then((customer) => {
      if (customer) {
        if (otpCode == customer.otpCode) {
          let checkOTPExpire = Date.now() > customer.otpExpireIn;
          checkOTPExpire
            ? res.status(409).send({
                message: "OTP is expired!!",
                isSuccess: false,
              })
            : res.status(200).send({
                message: "OTP verify successfully.",
                isSuccess: true,
              });
        } else {
          return res
            .status(409)
            .send({ message: "Invalid OTP", isSuccess: false });
        }
      } else {
        return res
          .status(404)
          .send({ message: "Email not found!", isSuccess: false });
      }
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const findEmail = await adminSchema.findOne({ email });
    if (!findEmail) {
      return res
        .status(403)
        .send({ message: "Email not found!", isSuccess: false });
    }
    const newpassword = await bcrypt.hash(password, 10);
    await adminSchema.findByIdAndUpdate(
      findEmail._id,
      {
        password: newpassword,
      },
      { new: true }
    );
    return res
      .status(200)
      .send({ message: "Reset password successfully.", isSuccess: true });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const adminId = req.admin._id;

    const profile = await adminSchema
      .findById(adminId)
      .select("_id fullName email userType")
      .populate("userType", "name");

    if (!profile) {
      return res.status(404).send({
        message: "User not found!",
        isSuccess: false,
      });
    }

    return res.status(200).send({
      data: profile,
      isSuccess: true,
      message: "Get admin data successfully.",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const adminId = req.admin._id;
    let { oldPassword, newPassword } = req.body;
    const findCustomer = await adminSchema.findOne(adminId);
    if (!findCustomer) {
      return res.status(200).send({
        message: "Admin not found!",
        isSuccess: false,
      });
    }
    const checkPassword = await bcrypt.compare(
      oldPassword,
      findCustomer.password
    );
    if (oldPassword == newPassword) {
      return res.status(409).send({
        message: "Old password and newpassword must be not same.",
        isSuccess: false,
      });
    }
    if (checkPassword) {
      newPassword = await bcrypt.hash(newPassword, 10);
      await adminSchema
        .findByIdAndUpdate(
          { _id: findCustomer._id },
          { password: newPassword },
          { new: true }
        )
        .then(() => {
          return res.status(200).send({
            message: `Your password changed successfully.`,
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
      return res.status(409).send({
        message: "Your old password is wrong!",
        isSuccess: false,
      });
    }
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { fieldId, isActive, modelName } = req.body;
    let ModelSchema;
    switch (modelName) {
      case "Videos":
        ModelSchema = videoSchema;
        break;
      case "page_content":
        ModelSchema = pageContentSchema;
        break;
      case "Schemes":
        ModelSchema = schemesSchema;
        break;
      case "permission":
        ModelSchema = PermissionModel;
        break;
      case "HomeSlider":
        ModelSchema = homeSliderSchema;
        break;
      case "Event":
        ModelSchema = eventSchema;
        break;
      case "City":
        ModelSchema = cityModel;
        break;
      case "Menu":
        ModelSchema = menuSchema;
        break;
      case "Banner":
        ModelSchema = bannerSchema;
        break;
      case "homeBannertop":
        ModelSchema = homeBannerTopModel;
        break;

      case "admin":
        ModelSchema = adminSchema;
        break;
      case "Certificates":
        ModelSchema = certificateSchema;
        break;
      case "CMS":
        ModelSchema = CmsSchema;
        break;
      case "page":
        ModelSchema = pageModel;
        break;
      case "HomeCmsContent":
        ModelSchema = pageContentSchema;
        break;
      case "Tab":
        ModelSchema = maayraAmbassadorsSchema;
        break;
      case "StoreLocator":
        ModelSchema = storeLocatorSchema;
        break;
      case "Testimonials":
        ModelSchema = testimonialsSchema;
        break;
      case "Policies":
        ModelSchema = policiesSchema;
        break;
      case "Disclousers":
        ModelSchema = disclousersSchema;
        break;
      case "BoardAndCommittees":
        ModelSchema = boardAndCommitteesSchema;
        break;
      case "Category":
        ModelSchema = categorySchema;
        break;
      case "Product":
        ModelSchema = productSchema;
        break;
      case "Metal":
        ModelSchema = metalSchema;
        break;
      case "Gender":
        ModelSchema = genderSchema;
        break;
      case "Brand":
        ModelSchema = brandSchema;
        break;
      // case "PageWiseContent":
      //   ModelSchema = pageWiseContentSchema;
      //   break;

      case "PageWiseFAQ":
        ModelSchema = pageWiseFaqSchema;
        break;
      case "GoldRate":
        ModelSchema = goldRateSchema;
        break;

      default:
        return res.status(404).send({
          message: "Invalid Field Name.",
          isSuccess: false,
        });
    }

    const findData = await ModelSchema.findById(fieldId);
    if (!findData) {
      return res.status(404).send({
        message: "Data not found!",
        isSuccess: false,
      });
    }
    await ModelSchema.findByIdAndUpdate(fieldId, { isActive }, { new: true })
      .then((data) => {
        return res.status(200).send({
          isSuccess: true,
          message: "Status updated successfully.",
        });
      })
      .catch((error) => {
        return res.status(500).send({
          error: error.message,
          message: "SomeThing went wrong, please try again!",
        });
      });
  } catch (error) {
    return res.status(500).send({
      error: error.message,
      message: "SomeThing went wrong, please try again!",
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

    const getData = await adminSchema
      .find()
      .skip(skip)
      .limit(limit)
      .populate("userType")
      .lean();
    const totalRecords = await adminSchema.countDocuments();
    return res.status(200).send({
      isSuccess: true,
      currentPageNo: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      message: "User listed successfully.",
      data: getData,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await adminSchema.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        isSuccess: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      isSuccess: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};
