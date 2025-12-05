const axios = require("axios");
// const { getToken } = require("../helpers/InstaTokenhandler");
require("dotenv").config();
const businessId = process.env.INSTAGRAM_ACCESS_BUSINESSID;
const instaFeed = async (req, res) => {
  try {
     const ACCESS_TOKEN =  process.env.INSTAGRAM_ACCESS_TOKEN;

    const { instagramFeedType, instagramActive } = req.body;

    if (!instagramActive) {
      return res.status(200).send({
        message: "Feed Type Closed By Admin",
        isSuccess: false,
      });
    }

    if (!businessId || !ACCESS_TOKEN) {
      return res.status(400).json({ error: "Missing businessId or accessToken" });
    }

    const url = `https://graph.facebook.com/v22.0/${businessId}/media?fields=id,caption,media_type,media_url,media_product_type,timestamp,permalink&access_token=${ACCESS_TOKEN}`;
    const response = await axios.get(url);
    const mediaItems = response.data.data;

    let filteredItems = [];
    if (instagramFeedType === "Image") {
      filteredItems = mediaItems.filter(item => item.media_type === "IMAGE");
    } 
    else if (instagramFeedType === "Video") {
      filteredItems = mediaItems.filter(item => item.media_type === "VIDEO");
    }
    else if (instagramFeedType === "All") {
      filteredItems = mediaItems.filter(item =>
        item.media_type === "VIDEO" || item.media_type === "IMAGE"
      );
    }
    else {
      return res.status(400).send({
        message: "Invalid instagramFeedType. Use: image | video | both",
        isSuccess: false,
      });
    }
    return res.status(200).json({
      isSuccess: true,
      message: "Instagram feed fetched successfully",
      data: filteredItems,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};
module.exports = { instaFeed };
