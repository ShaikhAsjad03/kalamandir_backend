const XLSX = require("xlsx");
const fs = require("fs/promises");
const path = require("path");
const productSchema = require("../models/product.model");
const categorySchema = require("../models/category.model");
const brandSchema = require("../models/brand.model");
const metalSchema = require("../models/metal.model");
const genderSchema = require("../models/gender.model");
const slugify = require("slugify");
const AdmZip = require("adm-zip");
const sharp = require("sharp");
const mongoose = require("mongoose");
const { processImage } = require("../helpers/common");
exports.importProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({
        isSuccess: false,
        message: "No Excel file uploaded!",
      });
    }

    const filePath = path.join(__dirname, `../public/excel/${req.file.filename}`);
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });

    if (!sheet.length) {
      await fs.unlink(filePath);
      return res.status(400).send({
        isSuccess: false,
        message: "Excel file is empty!",
      });
    }

    const [allCategories, allBrands, allMetals, allGenders, existingProducts] = await Promise.all([
      categorySchema.find().select("_id name parentId"),
      brandSchema.find().select("_id name parentId"),
      metalSchema.find().select("_id metal"),
      genderSchema.find().select("_id gender"),
      productSchema.find().select("_id productCode"),
    ]);

    const categoryMap = new Map(allCategories.map((c) => [c.name.toLowerCase().trim(), c]));
    const brandMap = new Map(allBrands.map((b) => [b.name.toLowerCase().trim(), b]));
    const metalMap = new Map(allMetals.map((m) => [m.metal.toLowerCase().trim(), m]));
    const genderMap = new Map(allGenders.map((g) => [g.gender.toLowerCase().trim(), g]));
    const existingMap = new Map(existingProducts.map((p) => [p.productCode, p._id]));

    const trimStr = (v) => (v ? String(v).trim() : "");
    const errors = [];
    const bulkOps = [];

    for (let i = 0; i < sheet.length; i++) {
      const row = sheet[i];
      const rowNum = i + 2;

      const categoryNames = trimStr(row.CategoryName || row.categoryName);
      const subCategoryNames = trimStr(row.SubCategoryName || row.subCategoryNames);
      const brandNames = trimStr(row.BrandName || row.brandName);
      const subBrandNames = trimStr(row.SubBrandName || row.subBrandNames);
      const metalName = trimStr(row.Metal || row.metal);
      const genderName = trimStr(row.FilterValue || row.Gender || row.gender);
      const productName = trimStr(row.ProductName || row.productName);
      const productCode = trimStr(row.ProductCode || row.productCode);

      if (!productName)
        errors.push({ row: rowNum, column: "ProductName", message: "Product Name is required." });
      if (!productCode)
        errors.push({ row: rowNum, column: "ProductCode", message: "Product Code is required." });
      if (!productName || !productCode) continue;

      const categoryArr = categoryNames.split(",").map((v) => v.trim()).filter(Boolean);
      const subCategoryArr = subCategoryNames.split(",").map((v) => v.trim()).filter(Boolean);
      const brandArr = brandNames.split(",").map((v) => v.trim()).filter(Boolean);
      const subBrandArr = subBrandNames.split(",").map((v) => v.trim()).filter(Boolean);

      const categoryIds = [];
      for (const catName of [...categoryArr, ...subCategoryArr]) {
        const key = catName.toLowerCase();
        const found = categoryMap.get(key);
        if (found) categoryIds.push(found._id);
        else
          errors.push({
            row: rowNum,
            column: "Category/SubCategory",
            message: `Category '${catName}' not found.`,
          });
      }

      const brandIds = [];
      for (const brandName of [...brandArr, ...subBrandArr]) {
        const key = brandName.toLowerCase();
        const found = brandMap.get(key);
        if (found) brandIds.push(found._id);
        else
          errors.push({
            row: rowNum,
            column: "Brand/SubBrand",
            message: `Brand '${brandName}' not found.`,
          });
      }

      const metal = metalName ? metalMap.get(metalName.toLowerCase()) : null;
      const gender = genderName ? genderMap.get(genderName.toLowerCase()) : null;

      if (metalName && !metal)
        errors.push({ row: rowNum, column: "Metal", message: `Metal '${metalName}' not found.` });
      if (genderName && !gender)
        errors.push({ row: rowNum, column: "Gender", message: `Gender '${genderName}' not found.` });




      const productData = {
        productName,
        productCode,
        slug: slugify(productName, { lower: true }),
        productDescription: trimStr(row.ProductDetail),
        sortOrder: Number(row.SortOrder) || 0,
        mrp: trimStr(row.MRP),
        approxMrp: trimStr(row.ApproxMRP),
        dailyGoldRate: trimStr(row.DailyGoldRate),
        stone: trimStr(row.Stone),
        netWeight: trimStr(row.NetWeight),
        grossWeight: trimStr(row.GrossWeight),
        diamondWeight: trimStr(row.DiamondWeight),
        otherWeight: trimStr(row.OtherWeightPcs),
        isActive:
          String(row.IsActive).toLowerCase().trim() === "y" ||
          String(row.IsActive).toLowerCase().trim() === "true",
        metal: metal ? metal._id : null,
        gender: gender ? gender._id : null,
        categoryId: categoryIds,
        brandId: brandIds,
        productImage: row.ImageName ? `products/${trimStr(row.ImageName)}` : "",
        ProductThumImg: row.ImageName ? `products/productsThumbnail/${trimStr(row.ImageName)}` : "",
      };

      const existingId = existingMap.get(productCode);
      if (existingId) {
        bulkOps.push({
          updateOne: {
            filter: { _id: existingId },
            update: { $set: productData },
          },
        });
      } else {
        bulkOps.push({
          insertOne: { document: productData },
        });
      }
    }

    if (errors.length > 0) {
      await fs.unlink(filePath);
      return res.status(400).send({
        isSuccess: false,
        message: "Validation failed. Import aborted.",
        errors,
      });
    }

    if (bulkOps.length > 0) {
      await productSchema.bulkWrite(bulkOps);
    }

    await fs.unlink(filePath);

    return res.status(200).send({
      isSuccess: true,
      message: `${bulkOps.length} products processed successfully (inserted/updated).`,
    });
  } catch (error) {
    return res.status(500).send({
      isSuccess: false,
      message: error.message,
    });
  }
};
exports.exportProducts = async (req, res) => {
  try {
    const { categoryIds, brandIds } = req.body;
    const filter = {};
    if (categoryIds && categoryIds.length > 0) {
      const catArray = Array.isArray(categoryIds) ? categoryIds : [categoryIds];
      filter.categoryId = { $in: catArray.map(id => new mongoose.Types.ObjectId(id)) };
    }

    if (brandIds && brandIds.length > 0) {
      const brandArray = Array.isArray(brandIds) ? brandIds : [brandIds];
      filter.brandId = { $in: brandArray.map(id => new mongoose.Types.ObjectId(id)) };
    }
    const products = await productSchema
      .find(filter)
      .populate("categoryId", "name")
      .populate("brandId", "name")
      .populate("metal", "metal")
      .populate("gender", "gender")
      .lean();

    if (!products.length) {
      return res
        .status(404)
        .send({ isSuccess: false, message: "No products found for selected filters!" });
    }

    const exportData = products.map((p, index) => {
      const mainImageFile = p.productImage ? path.basename(p.productImage) : "";
      const thumbImageFile = p.ProductThumImg ? path.basename(p.ProductThumImg) : "";
      return {
        CategoryName:
          Array.isArray(p.categoryId) && p.categoryId.length
            ? p.categoryId[0].name
            : p.categoryId?.name || "",
        SubCategoryNames: "",
        BrandName:
          Array.isArray(p.brandId) && p.brandId.length
            ? p.brandId[0].name
            : p.brandId?.name || "",
        SubBrandNames: "",
        ProductCode: p.productCode || "",
        ProductName: p.productName || "",
        ProductDetail: p.productDescription || "",
        SortOrder: index + 1,
        isActive: p.isActive ? "Y" : "N",
        ImageName: mainImageFile,
        NetWeight: p.netWeight || 0,
        GrossWeight: p.grossWeight || 0,
        DiamondWeight: p.diamondWeight || 0,
        OtherWeightPcs: p.otherWeight || 0,
        DailyGoldRate: p.dailyGoldRate || 0,
        ApproxMRP: p.approxMrp || 0,
        MRP: p.mrp || 0,
        FilterValue: p.gender?.gender || "",
        Stone: p.stone || "",
        Metal: p.metal?.metal || "",
      };
    });
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=products_export.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    return res.send(buffer);
  } catch (error) {
    return res
      .status(500)
      .send({ isSuccess: false, message: error.message });
  }
};

exports.importZipImages = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        isSuccess: false,
        message: "No ZIP file uploaded!",
      });
    }

    const ext = path.extname(req.file.originalname).toLowerCase();
    if (ext !== ".zip") {
      await fs.unlink(req.file.path).catch(() => { });
      return res.status(400).json({
        isSuccess: false,
        message: "Only ZIP files are allowed!",
      });
    }

    const productDir = path.join(__dirname, "../public/products");
    const zip = new AdmZip(req.file.path);
    zip.extractAllTo(productDir, true);
    await fs.unlink(req.file.path).catch(() => { });
    const files = await fs.readdir(productDir);

    for (const file of files) {
      const fullPath = path.join(productDir, file);

      const stat = await fs.stat(fullPath);
      if (!stat.isFile()) continue;
      if (!/\.(png|jpg|jpeg|webp)$/i.test(file)) continue;
      const sanitized = file.replace(/\s+/g, "-");
      const sanitizedPath = path.join(productDir, sanitized);

      if (file !== sanitized) {
        await fs.rename(fullPath, sanitizedPath);
      }
      const fakeImageFile = {
        path: sanitizedPath,
        filename: sanitized
      };
      await processImage(fakeImageFile);
    }

    return res.json({
      isSuccess: true,
      message: "ZIP extracted + thumbnails (with watermark) created successfully!",
    });

  } catch (error) {
    console.error("❌ ZIP IMPORT ERROR:", error);
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};
