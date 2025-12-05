const WebsiteSetting = require("../models/websiteSetting.model.js");
const { deleteImage, parseSocialMediaField } = require("../helpers/common.js");

exports.createOrUpdateWebsiteSetting = async (req, res) => {
  try {
    const {
      companyName,
      description,
      // address,
      emailInfo,
      emailSupport,
      contact,
      whatsappNo,
      socialMedia,
      collection_title,
      instagramFeedType,
      instagramActive,
      footerTextColor,
    } = req.body;

    const parsedSocialMedia = parseSocialMediaField(socialMedia, res);
    if (parsedSocialMedia === null) return;

    const webLogoFile = req.files?.find((f) => f.fieldname === "websiteLogo");
    let setting = await WebsiteSetting.findOne();

    const footerBackgroundImageFile = req.files?.find(
      (f) => f.fieldname === "footerBackgroundImage"
    );

    if (!setting) {
      setting = new WebsiteSetting({
        companyName: companyName || "",
        description: description || null,
        // address: address || "",
        emailInfo: emailInfo || "",
        emailSupport: emailSupport || null,
        contact: contact || "",
        whatsappNo: whatsappNo || "",
        socialMedia: parsedSocialMedia,
        collection_title: "",
        websiteLogo: webLogoFile
          ? "websiteSetting/webLogo/" + webLogoFile.filename
          : null,
        instagramFeedType: instagramFeedType || "All",
        instagramActive: instagramActive || false,
        footerBackgroundImage: footerBackgroundImageFile
          ? "websiteSetting/footer/" + footerBackgroundImageFile.filename
          : null,
        footerTextColor: footerTextColor || null,
      });

      await setting.save();
      return res.status(200).json({
        isSuccess: true,
        message: "Settings created successfully",
        data: setting,
      });
    } else {
      if (webLogoFile) {
        if (setting.websiteLogo) await deleteImage(setting.websiteLogo);
        setting.websiteLogo = "websiteSetting/webLogo/" + webLogoFile.filename;
      }

      if (footerBackgroundImageFile) {
        if (setting.footerBackgroundImage)
          await deleteImage(setting.footerBackgroundImage);
        setting.footerBackgroundImage =
          "websiteSetting/footer/" + footerBackgroundImageFile.filename;
      } else {
        if (setting.footerBackgroundImage)
          await deleteImage(setting.footerBackgroundImage);
        setting.footerBackgroundImage = null;
      }

      setting.companyName = companyName || setting.companyName;
      setting.description = description || null;
      // setting.address = address || setting.address;
      setting.emailInfo = emailInfo || setting.emailInfo;
      setting.emailSupport = emailSupport || null;
      setting.contact = contact || setting.contact;
      setting.whatsappNo = whatsappNo || setting.whatsappNo;
      setting.socialMedia = parsedSocialMedia;
      setting.collection_title = collection_title;
      setting.instagramFeedType =
        instagramFeedType || setting.instagramFeedType;
      setting.instagramActive = instagramActive || setting.instagramActive;
      (setting.footerTextColor = footerTextColor || null), await setting.save();
      return res.status(200).json({
        isSuccess: true,
        message: "Settings updated successfully",
        data: setting,
      });
    }
  } catch (error) {
    return res.status(500).json({ isSuccess: false, message: error.message });
  }
};

exports.getWebsiteSetting = async (req, res) => {
  try {
    const data = await WebsiteSetting.findOne();
    return res.status(200).json({
      isSuccess: true,
      message: "Settings fetched successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({ isSuccess: false, message: error.message });
  }
};
