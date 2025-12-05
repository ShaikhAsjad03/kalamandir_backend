const { deleteImage } = require("../helpers/common");
const slugify = require("slugify");
const homeBannerTopSchema = require("../models/homeBannerTop.model")
exports.createApi = async (req, res) => {
    try {
        if (req.fileValidationError) {
            return res.status(400).send({
                isSuccess: false,
                message: req.fileValidationError,
            });
        }

        let { sort_order_no, link, isActive, bannerType } = req.body;
        link ? (link = slugify(link, { lower: true })) : (link = "");
        const count = await homeBannerTopSchema.countDocuments({ bannerType });
        if (count >= 3) {
            return res.status(400).send({
                isSuccess: false,
                message: `Maximum 3 banners allowed for ${bannerType}.`,
            });
        }

        const createObj = {
            sort_order_no,
            link,
            isActive,
            bannerType,
        };

        const file = req.files?.find((file) => file.fieldname === "image");
        if (file) {
            createObj.image = "banner/home/" + file.filename;
        }

        const saveData = new homeBannerTopSchema(createObj);
        await saveData.save();

        return res.status(200).send({
            isSuccess: true,
            message: "Banner Top Added successfully.",
            data: saveData,
        });

    } catch (error) {
        return res.status(500).send({
            message: error.message,
            isSuccess: false,
        });
    }
};

exports.updateApi = async (req, res) => {
    try {
        if (req.fileValidationError) {
            return res.status(400).send({
                isSuccess: false,
                message: req.fileValidationError,
            });
        }

        let { banner_id, sort_order_no, link, isActive, bannerType } = req.body;
        link ? (link = slugify(link, { lower: true })) : (link = "");

        const findData = await homeBannerTopSchema.findById(banner_id);
        if (!findData) {
            return res.status(404).send({
                message: "Banner with this ID not found!",
                isSuccess: false,
            });
        }

        if (findData.bannerType !== bannerType) {
            const count = await homeBannerTopSchema.countDocuments({ bannerType });
            if (count >= 3) {
                return res.status(400).send({
                    isSuccess: false,
                    message: `Cannot change banner type — maximum 3 banners already exist for ${bannerType}.`,
                });
            }
        }

        const updateObj = {
            sort_order_no,
            bannerType,
            link,
            isActive,
        };

        const file = req.files?.find((file) => file.fieldname === "image");
        if (file) {
            const newImage = "banner/home/" + file.filename;
            if (findData.image) {
                await deleteImage(findData.image);
            }
            updateObj.image = newImage;
        }

        const updated = await homeBannerTopSchema.findByIdAndUpdate(
            banner_id,
            updateObj,
            { new: true }
        );

        return res.status(200).send({
            isSuccess: true,
            message: "Banner updated successfully.",
            data: updated,
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
        const banner_id = req.body.banner_id;
        await homeBannerTopSchema
            .findByIdAndDelete(banner_id)
            .then(async (data) => {
                if (!data) {
                    return res
                        .status(404)
                        .send({
                            message: "Home Banner with this id not found!",
                            isSuccess: false,
                        });
                }
                if (data.image) {
                    await deleteImage(data.image);
                }
                return res.status(200).send({
                    isSuccess: true,
                    message: "Home Banner deleted successfully.",
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
exports.getAllApis = async (req, res) => {
    try {
        const getData = await homeBannerTopSchema
            .find({ isActive: true })
            .sort({ sort_order_no: 1 });
        return res.status(200).send({
            isSuccess: true,
            message: "Banner top listed successfully.",
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
        const id = req.body.banner_id;
        const getData = await homeBannerTopSchema.findById(id);
        return res.status(200).send({
            isSuccess: true,
            message: "Get Banner top successfully.",
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
        let { page = 1, limit = 10 } = req.body;
        page = parseInt(page);
        limit = parseInt(limit);
        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 10;
        const skip = (page - 1) * limit;
        const getData = await homeBannerTopSchema
            .find()
            .sort({ sort_order_no: 1 })
            .skip(skip)
            .limit(limit);
        const totalRecords = await homeBannerTopSchema.countDocuments();
        return res.status(200).send({
            isSuccess: true,
            currentPageNo: page,
            totalPages: Math.ceil(totalRecords / limit),
            totalRecords,
            message: "Banner top listed successfully.",
            data: getData,
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
        const lastSortOrderItem = await homeBannerTopSchema
            .findOne()
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
