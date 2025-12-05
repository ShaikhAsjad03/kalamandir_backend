const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
const mongoose = require("mongoose");
const sharp = require("sharp");

/**
 * Checks if a given field in a collection contains a value matching either
 * a string or ObjectId representation of the given ID.
 *
 * @param {Model} model - Mongoose model to query (e.g., cmsModel)
 * @param {String} fieldName - The field name to check (e.g., "page_name")
 * @param {String} value - For Ex. The menu ID or any other ID to match
 * @returns {Promise<Array>} - Array of matching documents
 */


const deleteImage = (filePath) => {
  try {
    if (!filePath) return;

    if (Array.isArray(filePath)) {
      filePath.forEach((fp) => deleteImage(fp));
      return;
    }

    let fullPath = filePath;

    if (!path.isAbsolute(filePath)) {
      fullPath = path.join(__dirname, "../public", filePath);
    }

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.error("Error deleting image:", error.message);
  }
};


const parseSocialMediaField = (socialMedia, res) => {
  if (typeof socialMedia === "string") {
    try {
      return JSON.parse(socialMedia);
    } catch (e) {
      res.status(400).send({
        message: "Invalid JSON in socialMedia field",
        isSuccess: false,
      });
      return null;
    }
  }
  return socialMedia;
};

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-");
};

const getFullImageUrl = (req, imagePath) => {
  return `${req.protocol}://${req.get("host")}/${imagePath}`;
};
const deleteUploadedFiles = async (files, folder = "menu") => {
  if (!files) return;

  const fileArray = Array.isArray(files) ? files : [files];

  for (const file of fileArray) {
    let filePath = "";

    if (typeof file === "string") {
      if (file.includes("public/")) {
        filePath = path.join(__dirname, `../${file}`);
      } else {
        filePath = path.join(__dirname, `../public/${file}`);
      }
    } else if (file?.filename) {
      filePath = path.join(__dirname, `../public/${folder}/`, file.filename);
    }

    if (!filePath) continue;

    try {
      await fsPromises.access(filePath);
      await fsPromises.unlink(filePath);
    } catch (err) {
      if (err.code !== "ENOENT") {
        return console.error(`❌ Error deleting ${filePath}:`, err.message);
      }
    }
  }
};

async function checkLinkedDocuments(model, fieldName, value) {
  if (!model || !fieldName || !value) {
    throw new Error("Missing required parameters for checkLinkedDocuments");
  }

  const orConditions = [{ [fieldName]: value }];

  if (mongoose.Types.ObjectId.isValid(value)) {
    orConditions.push({ [fieldName]: new mongoose.Types.ObjectId(value) });
  }

  const results = await model.find({ $or: orConditions });
  return results;
}

async function processImage(imageFile, options = {}) {
  const {
    width = 360,
    height = 360,
    thumbDir = "./public/products/productsThumbnail",
    watermark = path.join(__dirname, "..", "public", "watermark", "watermark.png"),

    watermarkOpacity = 0.2,
    watermarkWidth = 200,
    watermarkHeight = 22,
    marginBottom = 6,
  } = options;

  if (!imageFile) throw new Error("No image file provided");

  const thumbFolder = path.resolve(thumbDir);
  if (!fs.existsSync(thumbFolder)) {
    fs.mkdirSync(thumbFolder, { recursive: true });
  }

  const originalPath = path.resolve(imageFile.path);
  const thumbPath = path.join(thumbFolder, imageFile.filename);

  try {
    const watermarkBuffer = await sharp(watermark)
      .resize({
        width: watermarkWidth,
        height: watermarkHeight,
        fit: "inside",
      })
      .png()
      .toBuffer();

    const watermarkWithMargin = await sharp({
      create: {
        width: watermarkWidth,
        height: watermarkHeight + marginBottom,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      }
    })
      .composite([
        {
          input: watermarkBuffer,
          top: 0,
          width: 100,
          left: 3
        }
      ])
      .png()
      .toBuffer();

    await sharp(originalPath)
      .resize({
        width,
        height,
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .composite([
        {
          input: watermarkWithMargin,
          gravity: "south",      
          opacity: watermarkOpacity,
        },
      ])
      .toFile(thumbPath);

    return {
      originalPath: `products/${imageFile.filename}`,
      thumbPath: `products/productsThumbnail/${imageFile.filename}`,
    };

  } catch (err) {
    console.error("❌ SHARP REAL ERROR:", err);
    throw new Error(err.message);
  }
}

const formatPopulate = (field) => {
  if (!field) return null;
  return {
    _id: field._id,
    name: field.name || field.metalName || field.genderName || field.brandName || field.categoryName || "",
    slug: field.slug || "",
  };
};


module.exports = {
  deleteImage,
  parseSocialMediaField,
  slugify,
  getFullImageUrl,
  deleteUploadedFiles,
  checkLinkedDocuments,
  processImage,
  formatPopulate
};
