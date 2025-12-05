const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storageSettings = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "headerLogo") {
      cb(null, "./public/websiteSetting/header/");
    } else if (file.fieldname === "websiteLogo") {
      cb(null, "./public/websiteSetting/webLogo/");
    } else if (file.fieldname === "footerBackgroundImage") {
      cb(null, "./public/websiteSetting/footer/");
    } else {
      cb(new Error("Invalid field name"), null);
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const storageMenu = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/menu/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "-"));
  },
});

const storageMainBrandBanner = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/mainBrand/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "-"));
  },
});

const storageProducts = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/products/");
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

// const storageProducts = multer.diskStorage({
//   destination: function (req, file, cb) {
//     if (file.fieldname === "productImage") {
//       cb(null, "./public/products/");
//     } else if (file.fieldname === "ProductThumImg") {
//       cb(null, "./public/products/productsThumbnail/");
//     } else {
//       cb(new Error("Invalid field name"), null);
//     }
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

const storageHomeBanner = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "desktopImage") {
      cb(null, "./public/homeBanner/desktop/");
    } else if (file.fieldname === "mobileImage") {
      cb(null, "./public/homeBanner/mobile/");
    } else {
      cb(new Error("Invalid field name"), null);
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const storageBanner = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "desktopImage") {
      cb(null, "./public/banner/desktop/");
    } else if (file.fieldname === "mobileImage") {
      cb(null, "./public/banner/mobile/");
    } else if (file.fieldname === "image") {
      cb(null, "./public/banner/home/");
    } else {
      cb(new Error("Invalid field name"), null);
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const storageBrand = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "brandLogo") {
      cb(null, "./public/brand/brandLogo/");
    } else if (file.fieldname === "brandImage") {
      cb(null, "./public/brand/brandImage/");
    } else if (file.fieldname === "bannerImage") {
      cb(null, "./public/brand/bannerImage/");
    } else {
      cb(new Error("Invalid field name"), null);
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const storageVideo = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/videos/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const storageCategory = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/category/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const storageBoxImage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/boxImages/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const storageStoreLocator = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/storeLocator/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const storageCertificate = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/certificate/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const storageCMS = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/cms/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const storagePolicies = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/policies/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const storageBoardAndCommittees = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/boardAndCommittees/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const storageDisclousers = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/disclousers/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const storagePageContent = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/pageContent/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(/\s+/g, "-"));
  },
});

const storageZip = multer.diskStorage({
  destination: function (req, file, cb) {
    const zipFolder = path.join(__dirname, `../public/zip/`);
    if (!fs.existsSync(zipFolder)) fs.mkdirSync(zipFolder, { recursive: true });
    cb(null, "./public/zip/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(/\s+/g, "-"));
  },
});

const storageCSV = multer.diskStorage({
  destination: function (req, file, cb) {
    const excelFolder = path.join(__dirname, `../public/excel/`);
    if (!fs.existsSync(excelFolder))
      fs.mkdirSync(excelFolder, { recursive: true });
    cb(null, "./public/excel/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(/\s+/g, "-"));
  },
});

const storageUpload = multer.diskStorage({
  destination: (req, file, cb) => {
    const label = req.query.label || "general";
    const uploadPath = path.join(__dirname, "../public", label);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const storageCity = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/city/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileExcelFilter = (req, file, cb) => {
  if (
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.mimetype === "application/vnd.ms-excel"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only Excel files are allowed!"), false);
  }
};

const fileZipFilter = (req, file, cb) => {
  const fileExtension = path.extname(file.originalname).toLowerCase();
  if (
    file.mimetype === "application/zip" ||
    file.mimetype === "application/x-zip-compressed" ||
    fileExtension === ".zip"
  ) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only Zip files are allowed!"), false); // Reject the file
  }
};

const fileBannerFilter = (req, file, cb) => {
  const isImage = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ].includes(file.mimetype);

  const isVideo = [
    "video/mp4",
    "video/mpeg",
    "video/webm",
    "video/ogg",
    "video/quicktime",
  ].includes(file.mimetype);
  const bannerType = req.body.bannerType?.toLowerCase();

  if (!bannerType) {
    req.fileValidationError = "Missing bannerType field";
    return cb(null, false);
  }

  if (bannerType === "image") {
    if (isImage) return cb(null, true);
    req.fileValidationError =
      "Only image files are allowed for image bannerType";
    return cb(null, false);
  }

  if (bannerType === "top" || bannerType === "bottom") {
    if (isImage) return cb(null, true);
    req.fileValidationError =
      "Only image files are allowed for image bannerType";
    return cb(null, false);
  }

  if (bannerType === "video") {
    if (isVideo) return cb(null, true);
    req.fileValidationError =
      "Only video files are allowed for video bannerType";
    return cb(null, false);
  }

  req.fileValidationError = "Invalid bannerType value";
  return cb(null, false);
};

const fileSliderFilter = (req, file, cb) => {
  const isImage = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ].includes(file.mimetype);

  const isVideo = [
    "video/mp4",
    "video/mpeg",
    "video/webm",
    "video/ogg",
    "video/quicktime",
  ].includes(file.mimetype);

  const bannerType = req.body.bannerType?.toLowerCase();

  if (!bannerType) {
    req.fileValidationError = "Missing bannerType field";
    return cb(null, false);
  }

  if (bannerType === "image") {
    if (isImage) return cb(null, true);
    req.fileValidationError =
      "Only image files are allowed for image bannerType";
    return cb(null, false);
  }

  if (bannerType === "video") {
    if (isVideo) return cb(null, true);
    req.fileValidationError =
      "Only video files are allowed for video bannerType";
    return cb(null, false);
  }

  req.fileValidationError = "Invalid bannerType value";
  return cb(null, false);
};

const upload = multer({ storage: storageUpload });

// const fileImagePDFFilter = (req, file, cb) => {
//   const allowedMimeTypes = [
//     "image/png",
//     "image/jpeg",
//     "image/jpg",
//     "image/svg+xml",
//     "image/webp",
//     "application/pdf",
//     "application/msword", // .doc
//     "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
//   ];
//   if (allowedMimeTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     req.fileValidationError =
//       "Only Image, PDF, and DOC/DOCX files are allowed.";
//     cb(null, false);
//   }
// };

// const memoryStorage = multer.memoryStorage();

const fileImageFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype == "image/svg+xml" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/gif" ||
    file.mimetype === "image/webp"
  ) {
    return cb(null, true);
  } else {
    req.fileValidationError = "Please upload valid file type";
    return cb(null, false);
  }
};

const fileVideoFilter = (req, file, cb) => {
  if (
    file.mimetype === "video/mp4" ||
    file.mimetype === "video/mpeg" ||
    file.mimetype === "video/webm" ||
    file.mimetype === "video/ogg" ||
    file.mimetype === "video/quicktime"
  ) {
    return cb(null, true);
  } else {
    req.fileValidationError = "Please upload valid video file type";
    return cb(null, false);
  }
};

const fileDocFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/pdf" ||
    file.mimetype === "application/msword" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return cb(null, true);
  } else {
    req.fileValidationError = "Please upload valid PDF file type";
    return cb(null, false);
  }
};

const uploadMenu = multer({
  storage: storageMenu,
  fileFilter: fileImageFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
}).array("submenuImages", 3);

const uploadSettings = multer({
  storage: storageSettings,
  fileFilter: fileImageFilter,
  limits: {
    fieldSize: 10 * 1024 * 1024, // 10 MB per fields
  },
}).any();

const uploadCategory = multer({
  storage: storageCategory,
  fileFilter: fileImageFilter,
  limits: {
    fieldSize: 10 * 1024 * 1024, // 10 MB per fields
  },
}).fields([
  { name: "logoImage", maxCount: 1 },
  { name: "categoryImage", maxCount: 1 },
  { name: "boxImage", maxCount: 1 },
]);

const uploadVideos = multer({
  storage: storageVideo,
  fileFilter: fileVideoFilter,
  limits: {
    fieldSize: 50 * 1024 * 1024, // 50 MB per fields
  },
}).any();

const uploadCMSImage = multer({
  storage: storageCMS,
  fileFilter: fileImageFilter,
  limits: { fieldSize: 10 * 1024 * 1024 },
}).array("images", 10);

const uploadHomeBanner = multer({
  storage: storageHomeBanner,
  fileFilter: fileSliderFilter,
  limits: {
    fieldSize: 10 * 1024 * 1024, // 10 MB per fields
  },
}).any();

const uploadMainBrandBanner = multer({
  storage: storageMainBrandBanner,
  fileFilter: fileImageFilter,
  limits: {
    fieldSize: 10 * 1024 * 1024, // 10 MB per fields
  },
}).fields([
  { name: "logoImage", maxCount: 1 },
  { name: "categoryImage", maxCount: 1 },
  { name: "boxImage", maxCount: 1 },
]);

const uploadProducts = multer({
  storage: storageProducts,
  fileFilter: fileImageFilter,
  limits: {
    fieldSize: 10 * 1024 * 1024, // 10 MB per fields
  },
}).any();

const uploadBoxImages = multer({
  storage: storageBoxImage,
  fileFilter: fileImageFilter,
  limits: {
    fieldSize: 10 * 1024 * 1024, // 10 MB per fields
  },
}).array("images", 10);

const uploadBanner = multer({
  storage: storageBanner,
  fileFilter: fileBannerFilter,
  limits: {
    fieldSize: 10 * 1024 * 1024, // 10 MB per fields
  },
}).any();

const uploadBrand = multer({
  storage: storageBrand,
  fileFilter: fileImageFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB per file
  },
}).fields([
  { name: "brandLogo", maxCount: 1 },
  { name: "brandImage", maxCount: 1 },
  { name: "bannerImage", maxCount: 1 },
]);

const uploadCertificate = multer({
  storage: storageCertificate,
  fileFilter: fileImageFilter,
  limits: {
    // limit per file (20 MB). Adjust as needed.
    fileSize: 20 * 1024 * 1024,
  },
}).any();

const uploadStoreLocator = multer({
  storage: storageStoreLocator,
  fileFilter: fileImageFilter,
  limits: {
    fieldSize: 10 * 1024 * 1024,
  },
}).any();

const uploadPolicies = multer({
  storage: storagePolicies,
  fileFilter: fileDocFilter,
  limits: {
    fieldSize: 10 * 1024 * 1024,
  },
}).any();

const uploadBoardAndCommittees = multer({
  storage: storageBoardAndCommittees,
  fileFilter: fileDocFilter,
  limits: {
    fieldSize: 10 * 1024 * 1024,
  },
}).any();

const uploadDisclousers = multer({
  storage: storageDisclousers,
  fileFilter: fileDocFilter,
  limits: {
    fieldSize: 10 * 1024 * 1024,
  },
}).any();

const uploadPageContentImage = multer({
  storage: storagePageContent,
  fileFilter: fileImageFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).array("images", 10);

const uploadExcel = multer({
  storage: storageCSV,
  fileFilter: fileExcelFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
}).single("excelFile");

const uploadZip = multer({
  storage: storageZip,
  fileFilter: fileZipFilter,
  limits: {
    fileSize: 28 * 1024 * 1024,
  },
}).single("zipFile");

const uploadCity = multer({
  storage: storageCity,
  fileFilter: fileImageFilter,
  limits: {
    fieldSize: 10 * 1024 * 1024, // 10 MB per fields
  },
}).single("image");

module.exports = {
  uploadSettings,
  uploadHomeBanner,
  uploadCMSImage,
  uploadBanner,
  uploadCertificate,
  uploadPageContentImage,
  uploadStoreLocator,
  uploadVideos,
  uploadPolicies,
  uploadBoardAndCommittees,
  uploadDisclousers,
  uploadMenu,
  uploadBrand,
  uploadBoxImages,
  uploadCategory,
  uploadProducts,
  uploadMainBrandBanner,
  uploadExcel,
  upload,
  uploadZip,
  uploadCity,
};
