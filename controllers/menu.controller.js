const menusSchema = require("../models/menu.model");
const bannersSchema = require("../models/banner.model");
const brandSchema = require("../models/brand.model");
const categorySchema = require("../models/category.model");
const cmsModel = require("../models/cms.model");
const homeCMSContentSchema = require("../models/homeCMSContent.model");
const pageWiseContentSchema = require("../models/pageWiseContent.model");
const pagewiseFaqSchema = require("../models/pageWiseFAQ.model");

const { deleteImage, deleteUploadedFiles, checkLinkedDocuments } = require("../helpers/common");
const { default: slugify } = require("slugify");
const bodyParser = require("body-parser");

exports.createMenu = async (req, res) => {
  try {
    let {
      sort_order_no,
      menuType,
      menuName,
      menuURL,
      metaTitle,
      metakeyword,
      metaDescription,
      parentId,
      brandId,
      categoryId,
      isActive,
      showInHeader,
      showInFooter,
      cmsId,
    } = req.body;
    cmsId = cmsId === "null" ? null : cmsId;
    brandId = brandId === "null" ? null : brandId;
    categoryId = categoryId === "null" ? null : categoryId;
    parentId = parentId === "null" ? null : parentId;
    const slugs = menuURL ? slugify(menuURL, { lower: true }) : slugify(title, { lower: true });
    const checkExists = await menusSchema.findOne({ slugs });
    if (checkExists) {
      return res.status(409).send({
        message: "Menu URL already exists!",
        isSuccess: false,
      });
    }

    const createObj = {
      sort_order_no,
      menuType,
      menuName,
      menuURL: slugs,
      metaTitle,
      metakeyword,
      metaDescription,
      parentId,
      isActive,
      showInHeader,
      showInFooter,
      cmsId,
      brandId,
      categoryId,
    };
    const saveData = await menusSchema(createObj);
    await saveData.save();
    return res.status(200).send({
      isSuccess: true,
      message: "Menu Added successfully.",
      data: saveData,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

exports.updateMenu = async (req, res) => {
  try {
    let {
      menu_id,
      sort_order_no,
      menuType,
      menuName,
      menuURL,
      metaTitle,
      metakeyword,
      metaDescription,
      parentId,
      isActive,
      showInHeader,
      showInFooter,
      cmsId,
      brandId,
      categoryId
    } = req.body;
    cmsId = cmsId === "null" ? null : cmsId;
    brandId = brandId === "null" ? null : brandId;
    categoryId = categoryId === "null" ? null : categoryId;
    parentId = parentId === "null" ? null : parentId;

    const slugs = menuURL ? menuURL : slugify(title, { lower: true });

    const findData = await menusSchema.findById(menu_id);
    if (!findData) {
      return res.status(404).send({
        message: "Menu not found!",
        isSuccess: false,
      });
    }

    const updateObj = {
      sort_order_no,
      menuType,
      menuName,
      menuURL: slugs,
      metaTitle,
      metakeyword,
      metaDescription,
      parentId,
      isActive,
      showInHeader,
      showInFooter,
      cmsId,
      brandId,
      categoryId,
      submenuImages: findData.submenuImages || [],
    };
    await menusSchema.findByIdAndUpdate(menu_id, updateObj, { new: true });
    return res.status(200).send({
      isSuccess: true,
      message: "Menu updated successfully.",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

exports.deleteMenu = async (req, res) => {
  try {
    const menuId = req.body.menu_id;
    let existingMenu = await menusSchema.findById(menuId);

    if (!existingMenu) {
      return res.status(404).send({
        isSuccess: false,
        message: "Menu not found with this id",
      });
    }

    const linkedCms = await checkLinkedDocuments(cmsModel, "page_name", menuId);
    if (linkedCms.length > 0) {
      return res.status(400).json({
        isSuccess: false,
        message: `Could Not Delete Menu Because It is Linked With ${linkedCms.length} Cms. You Can Freeze It Instead.`,
      });
    }

    // Check if menu has any linked home cms
    const linkedHomeCmsContent = await checkLinkedDocuments(homeCMSContentSchema, "page_name", menuId);
    if (linkedHomeCmsContent.length > 0) {
      return res.status(400).json({
        isSuccess: false,
        message: `Could Not Delete Menu Because It is Linked With ${linkedHomeCmsContent.length} Home CMS Content. You Can Freeze It Instead.`,
      })
    }

    // Check if menu has any linked page wise content
    const linkedPageWiseContent = await checkLinkedDocuments(pageWiseContentSchema, "page_name", menuId);
    if (linkedPageWiseContent.length > 0) {
      return res.status(400).json({
        isSuccess: false,
        message: `Could Not Delete Menu Because It is Linked With ${linkedPageWiseContent.length} Page Wise Content. You Can Freeze It Instead.`
      })
    }
    const linkedPageWiseFaq = await checkLinkedDocuments(pagewiseFaqSchema, "page_name", menuId);
    if (linkedPageWiseFaq.length > 0) {
      return res.status(400).json({
        isSuccess: false,
        message: `Could Not Delete Menu Because It is Linked With ${linkedPageWiseFaq.length} Page Wise FAQ. You Can Freeze It Instead.`
      })
    }
    let existMenuInBanner = await bannersSchema.find({ menuId: menuId });
    if (existMenuInBanner.length > 0) {
      return res.status(400).send({ isSuccess: false, message: `Could Not Delete Menu Because It is Linked With ${existMenuInBanner.length} Banner But You Can Freeze It` });
    }
    let existMenuInBrand = await brandSchema.find({ menuId: menuId });
    if (existMenuInBrand.length > 0) {
      return res.status(400).send({ isSuccess: false, message: `Could Not Delete Menu Because It is Linked With ${existMenuInBrand.length} Brand But You Can Freeze It` });
    }

    let existMenuInCategory = await categorySchema.find({ menuId: menuId });
    if (existMenuInCategory.length > 0) {
      return res.status(400).send({ isSuccess: false, message: `Could Not Delete Menu Because It is Linked With ${existMenuInCategory.length} Category But You Can Freeze It` });
    }
    let existMenu = await menusSchema.find({ parentId: menuId });
    if (existMenu.length > 0) {
      return res.status(400).send({ isSuccess: false, message: `Could Not Delete Menu Because It is Linked With ${existMenu.length} Menu But You Can Freeze It` });
    }


    let existMenuIdInSubmenu = await menusSchema.find({ parentId: menuId });
    if (existMenuIdInSubmenu) {
      let existingMenu = await menusSchema.find({ parentId: menuId });
      existingMenu.map(async (menu) => {
        await menusSchema.findByIdAndDelete(menu._id);
      });
    }

    await menusSchema.findByIdAndDelete(menuId);

    return res.status(200).send({
      isSuccess: true,
      message: "Menu deleted successfully.",
    });

  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

exports.getAllMenus = async (req, res) => {
  try {
    let { parentId } = req.query;
    let query = { isActive: true };
    if (parentId && parentId === "all") {
    }
    else if (!parentId || parentId === "null") {
      query.parentId = null;
    }
    else {
      query.parentId = parentId;
    }
    const menus = await menusSchema.find(query).sort({ sort_order_no: 1 });
    if (!menus || menus.length === 0) {
      return res.status(200).json({
        isSuccess: false,
        message: "No menus found.",
      });
    }
    let message =
      parentId === "all"
        ? "All menus listed successfully."
        : parentId && parentId !== "null"
          ? "Sub-menus listed successfully."
          : "Top-level menus listed successfully.";

    return res.status(200).json({
      isSuccess: true,
      message,
      data: menus,
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};


function formatMenu(menu) {
  return {
    id: menu._id.toString(),
    menuName: menu.menuName,
    menuURL: menu.menuURL || "",
    menuType: menu.menuType || "",
    metaTitle: menu.metaTitle || "",
    metakeyword: menu.metakeyword || "",
    metaDescription: menu.metaDescription || "",
    isActive: menu.isActive,
    showInHeader: menu.showInHeader,
    showInFooter: menu.showInFooter,
    // submenuImages: menu.submenuImages || [],
    category: menu.categoryId
      ? {
        id: menu.categoryId._id?.toString(),
        name: menu.categoryId.name || "",
        categoryImage: menu.categoryId.categoryImage || "",
        boxImage: menu.categoryId.boxImage || "",
      }
      : null,

    brand: menu.brandId
      ? {
        id: menu.brandId._id?.toString(),
        name: menu.brandId.name || "",
        logoImage: menu.brandId.logoImage || "",
        boxImage: menu.brandId.boxImage || "",
        categoryImage: menu.brandId.categoryImage || "",
      }
      : null,



    submenu: (menu.submenu || []).map(formatMenu),
  };
}
exports.getMenus = async (req, res) => {
  try {
    const { parentId } = req.query;
    const menus = await menusSchema
      .find({ isActive: true })
      .populate({
        path: "categoryId",
        select: "_id name categoryImage logoImage boxImage",
        model: categorySchema,
      })
      .populate({
        path: "brandId",
        select: "_id name logoImage boxImage categoryImage",
        model: brandSchema,
      })
      .sort({ sort_order_no: 1 })
      .lean();

    if (!menus.length) {
      return res.status(200).json({
        isSuccess: false,
        message: "No menus found.",
        data: [],
      });
    }
    const menuMap = {};
    menus.forEach((menu) => {
      menu.submenu = [];
      menuMap[menu._id.toString()] = menu;
    });

    const tree = [];
    menus.forEach((menu) => {
      if (menu.parentId) {
        const parent = menuMap[menu.parentId.toString()];
        if (parent) parent.submenu.push(menu);
      } else {
        tree.push(menu);
      }
    });

    const result =
      parentId === "all" || !parentId || parentId === "null"
        ? tree
        : menuMap[parentId]?.submenu || [];

    const formatted = result.map(formatMenu);

    return res.status(200).json({
      isSuccess: true,
      message: "Menus fetched successfully",
      data: formatted,
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};


// exports.getAllMenus = async (req, res) => {
//   try {
//     const { showInHeader, showInFooter } = req.body || req.query || {};

//     const filter = {
//       menuType: { $ne: "SubMenu" },
//       isActive: true,
//     };
//     if (typeof showInHeader !== "undefined") {
//       filter.showInHeader = showInHeader;
//     }
//     if (typeof showInFooter !== "undefined") {
//       filter.showInFooter = showInFooter;
//     }

//     const getData = await menusSchema
//       .find(filter)
//       .populate("parentId")
//       .populate("cmsId")
//       .sort({ sort_order_no: 1 });

//     return res.status(200).send({
//       isSuccess: true,
//       message: "Menus listed successfully.",
//       data: getData,
//     });
//   } catch (error) {
//     return res.status(500).send({
//       message: error.message,
//       isSuccess: false,
//     });
//   }
// };


exports.getDataById = async (req, res) => {
  try {
    const menu_id = req.body.menu_id;
    const getData = await menusSchema.findById(menu_id);
    return res.status(200).send({
      isSuccess: true,
      message: "Get Menu successfully.",
      data: getData,
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
    let { page = 1, limit = 10, parentId } = req.body;
    page = parseInt(page);
    limit = parseInt(limit);
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;
    const skip = (page - 1) * limit;
    const filter = {};
    if (parentId) {
      filter.parentId = parentId;
    }
    const getData = await menusSchema
      .find(filter)
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);
    const totalRecords = await menusSchema.countDocuments(filter);
    return res.status(200).send({
      isSuccess: true,
      currentPageNo: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      message: "Menus listed successfully.",
      data: getData,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

exports.getPaginationParentData = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.body;
    page = parseInt(page);
    limit = parseInt(limit);
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;
    const skip = (page - 1) * limit;
    const getData = await menusSchema
      .find({ parentId: null })
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);
    const totalRecords = await menusSchema.countDocuments({ parentId: null });
    const data = await Promise.all(
      getData.map(async (menu) => {
        const subMenuCount = await menusSchema.countDocuments({
          parentId: menu._id,
        });
        menu.subMenuCount = subMenuCount;
        return menu;
      })
    );
    return res.status(200).send({
      isSuccess: true,
      currentPageNo: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      message: "Data listing successfully.",
      data: data,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

exports.getLastSrNo = async (req, res) => {
  try {
    const parentId = req.body.parentId;
    const lastSortOrderItem = await menusSchema
      .findOne({ parentId })
      .sort({ sort_order_no: -1 });
    return res.status(200).send({
      isSuccess: true,
      data: lastSortOrderItem,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

exports.getLastParentSrNo = async (req, res) => {
  try {
    const lastSortOrderItem = await menusSchema
      .findOne({ parentId: null })
      .sort({ sort_order_no: -1 });
    return res.status(200).send({
      isSuccess: true,
      data: lastSortOrderItem,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};
