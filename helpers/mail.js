const nodemailer = require("nodemailer");
const emailSettingsSchema = require("../models/emailSettings.model");
const websiteSettingModel = require("../models/websiteSetting.model");

const sendMail = async (
  recipientEmail,
  subject,
  html,
  ccEmail,
  bccEmail,
  // attachments = []
) => {
  const getEmailData = await emailSettingsSchema.findOne();
  const getLogo = await websiteSettingModel
    .findOne()
    .then((data) => data.websiteLogo);
  const transporter = nodemailer.createTransport({
    host: getEmailData.host,
    port: getEmailData.port,
    secure: false,
    auth: {
      user: getEmailData.email,
      pass: getEmailData.password,
    },
  });
  // attachments = [
  //   {
  //     filename: "logo.png",
  //     path: `./public/${getLogo}`,
  //     cid: "companyLogo",
  //   },
  // ];
  const mailOptions = {
    from: getEmailData.email,
    to: recipientEmail,
    subject,
    html,
    // attachments,
    ...(ccEmail && { cc: ccEmail }),
    ...(bccEmail && { bcc: bccEmail }),
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = { sendMail };
