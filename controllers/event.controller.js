const eventSchema=require("../models/event.model")
exports.createEvent = async (req, res) => {
  try {
    const { name,type} = req.body;
    const findEvent = await eventSchema.findOne({type: type,});
    if (findEvent) {
      return res
        .status(409)
        .send({ message: "Event is already existing!", isSuccess: false });
    } else {
     const newEvent =  eventSchema({ name ,type});
    await newEvent.save(); 
      return res.status(200).send({
        isSuccess: true,
        message: "Event created successfully.",
        data: newEvent,
      });
    }
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};
exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const { name,type} = req.body;
    const getEvent = await eventSchema.findById(eventId);
    if (!getEvent) {
      return res.status(404).send({
        message: "Invalid Event id!",
        isSuccess: false,
      });
    }
    
    const updateEvent = await pageSchema.findOne({
      _id: { $ne: eventId },
      name: name,
      type:type
    });
    if (updateEvent) {
      return res.status(409).send({
        message: "Event is already existing!",
        isSuccess: false,
      });
    }
    await events
      .findByIdAndUpdate(pageId, { name }, { new: true })
      .then((ev) => {
        if (!ev) {
          return res.status(404).send({
            message: "Event not found!",
            isSuccess: false,
          });
        }
        return res.status(200).send({
          message: "Event updated successfully.",
          isSuccess: true,
          data: events,
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
exports.listAllEvent= async (req, res) => {
  try {
    let { search, pageNo, perPage } = req.body;
    pageNo = pageNo ? pageNo : 1;
    perPage = perPage ? perPage : 10;
    const filter = {};
    if (search && search.trim() !== "") {
      filter.name = { $regex: `${search}`, $options: "i" };
    }
    await eventSchema
      .find(filter)
      .skip(perPage * pageNo - perPage)
      .limit(perPage)
      .then(async (data) => {
        const totalRecords = await eventSchema.countDocuments();
        return res.status(200).send({
          data,
          currentPageNo: pageNo,
          totalRecords: totalRecords,
          totalPages: Math.ceil(totalRecords / perPage),
          isSuccess: true,
          message: "Event listing successfully.",
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
exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    await eventSchema
      .findByIdAndDelete(eventId)
      .then((event) => {
        if (!event)
          return res
            .status(404)
            .send({ message: "Event not found!", isSuccess: false });
        return res
          .status(200)
          .send({ message: "Event deleted successfully.", isSuccess: true });
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
exports.updateStatus = async (req, res) => {
  try {
    const { fieldId, isActive } = req.body;
    const status = isActive === true || isActive === "true";
    if (status === true) {
      await eventSchema.updateMany(
        { _id: { $ne: fieldId } },
        { isActive: false }
      );
    }
    const updated = await eventSchema.findByIdAndUpdate(
      fieldId,
      { isActive: status },
      { new: true }
    );

    res.send({
      isSuccess: true,
      message: "Status updated",
      data: updated
    });
  } catch (err) {
    res.status(500).send({ isSuccess: false, message: err.message });
  }
};

exports.getActiveEvent = async (req, res) => {
  try {
    const activeEvent = await eventSchema.findOne({ isActive: true });
    if (!activeEvent) {
      return res.status(200).json({
        isSuccess: false,
        message: "No active event found",
      });
    }
    res.status(200).json({
      isSuccess: true,
      message: "Active event fetched successfully",
      data: activeEvent,
    });

  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};
