const Brand = require("../models/brand.model");
const Category = require("../models/category.model");
exports.getOrCreateBrands = async (brandNameStr, subBrandStr) => {
  const brandIds = [];
  const brandNames = brandNameStr?.split(",").map(b => b.trim()).filter(Boolean) || [];

  for (const name of brandNames) {
    let brand = await Brand.findOne({ name });
    if (!brand) brand = await Brand.create({ name });
    brandIds.push(brand._id);
    const subBrandNames = subBrandStr?.split(",").map(b => b.trim()).filter(Boolean) || [];
    for (const subName of subBrandNames) {
      let subBrand = await Brand.findOne({ name: subName });
      if (!subBrand) subBrand = await Brand.create({ name: subName, parentId: brand._id });
      brandIds.push(subBrand._id);
    }
  }

  return [...new Set(brandIds)];
};

exports.getOrCreateCategories = async (categoryStr, subCategoryStr) => {
  const categoryIds = [];
  const categoryNames = categoryStr?.split(",").map(c => c.trim()).filter(Boolean) || [];

  for (const name of categoryNames) {
    let cat = await Category.findOne({ name });
    if (!cat) cat = await Category.create({ name });
    categoryIds.push(cat._id);

    const subNames = subCategoryStr?.split(",").map(c => c.trim()).filter(Boolean) || [];
    for (const sub of subNames) {
      let subCat = await Category.findOne({ name: sub });
      if (!subCat) subCat = await Category.create({ name: sub, parentId: cat._id });
      categoryIds.push(subCat._id);
    }
  }

  return [...new Set(categoryIds)];
};
