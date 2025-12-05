const path = require("path");
const fs = require("fs");
const Cms = require("../models/cms.model");
const PageContent = require("../models/homeCMSContent.model");
const PageWiseContent = require("../models/pageWiseContent.model");

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    //${req.protocol}://${req.get("host")}/importExportImage/thumbnail_image/${thumbnailFile.filename}
    const label = req.query.label || "general";
    const filename = req.file.filename;

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: `/${label}/${filename}`,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { imageUrl, cmsId, pageContentId,  pageWiseContentId, } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ success: false, message: "Image URL required" });
    }

    const relativePath = imageUrl.replace(/^\//, "");
    const filePath = path.join(__dirname, "../public", relativePath);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    if (cmsId) {
      await Cms.findByIdAndUpdate(
        cmsId,
        { $pull: { images: imageUrl } },
        { new: true }
      );
    }

    if (pageContentId) {
      await PageContent.findByIdAndUpdate(
        pageContentId,
        { $pull: { images: imageUrl } },
        { new: true }
      );
    }

    if (pageWiseContentId) {
      await PageWiseContent.findByIdAndUpdate(
        pageWiseContentId,
        { $pull: { images: imageUrl } },
        { new: true }
      );
    }

  

    

    return res.json({ success: true, message: "Image deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Error deleting image" });
  }
};

exports.removeImage = async (req, res) => {
  try {
    const { file } = req.body;

    if (!file) {
      return res.status(400).json({ success: false, message: "Image URL required" });
    }

    const relativePath = file.replace(/^\//, ""); F
    const filePath = path.join(__dirname, "../public", relativePath);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return res.json({ success: true, message: "Image deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error deleting image" });
  }
}