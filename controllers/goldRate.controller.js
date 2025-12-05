const goldRateSchema = require("../models/goleRate.model");

exports.createApi = async (req, res) => {
  try {
    const { date, rate18K, rate22K, isActive } = req.body;

    const updateObj = {
      date,
      rate18K,
      rate22K,
      isActive
    };

    const existingData = await goldRateSchema.findOne();

    if (existingData) {
      const updatedData = await goldRateSchema.findByIdAndUpdate(
        existingData._id,
        updateObj,
        { new: true } 
      );

      return res.status(200).send({
        isSuccess: true,
        message: "Gold Rate updated successfully.",
        data: updatedData,
      });
    } else {
      const newData = new goldRateSchema(updateObj);
      await newData.save();

      return res.status(200).send({
        isSuccess: true,
        message: "Gold Rate added successfully.",
        data: newData,
      });
    }
  } catch (error) {
    return res.status(500).send({
      isSuccess: false,
      message: error.message,
    });
  }
};


exports.updateApi = async (req, res) => {
  try {
    const { gold_rate_id, date, rate18K, rate22K, isActive } = req.body;

    const findData = await goldRateSchema.findById(gold_rate_id);
    if (!findData) {
      return res.status(200).send({
        message: "Gold Rate with this id not found!",
        isSuccess: false,
      });
    }
    const updateObj = {
      date,
      rate18K,
      rate22K,
      isActive,
    };

    await goldRateSchema
      .findByIdAndUpdate(gold_rate_id, updateObj, { new: true })
      .then(async (data) => {
        return res.status(200).send({
          isSuccess: true,
          message: "Gold Rate updated successfully.",
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

// exports.deleteApi = async (req, res) => {
//   try {
//     const gold_rate_id = req.body.gold_rate_id;


//     let existGoldRateData = await goldRateSchema.findById({ _id: gold_rate_id });

//     if (!existGoldRateData) {
//       return res.status(404).send({
//         message: "Gold Rate with this id not found!",
//         isSuccess: false,
//       });
//     }

//     await goldRateSchema.findByIdAndDelete(gold_rate_id)

//     return res.status(200).send({
//       isSuccess: true,
//       message: "Gold Rate deleted successfully.",
//     });
//   } catch (error) {
//     return res.status(500).send({
//       message: error.message,
//       isSuccess: false,
//     });
//   }
// };

exports.getAllApis = async (req, res) => {
  try {
    const getData = await goldRateSchema
      .find({ isActive: true }).sort({ updatedAt: -1 })
    return res.status(200).send({
      isSuccess: true,
      message: "Gold Rate listed successfully.",
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
    const gold_rate_id = req.body.gold_rate_id;
    const getData = await goldRateSchema.findById(gold_rate_id);
    return res.status(200).send({
      isSuccess: true,
      message: "Gold Rate fetched successfully.",
      data: getData,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};
