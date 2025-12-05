const express = require("express");
const router = express.Router();

// Import route files
const adminRoute = require("./admin.route");
const menuRoute = require("./menu.route");
const cmsRoute = require("./cms.route");
const bannerRoute = require("./banner.route");
//setting routes
const emailSettingRoute = require("./emailSetting.route");
const websiteSettingRoute = require("./websiteSetting.route");
//masters routes
const certificateRoute = require("./certificate.route");
const videosRoute = require("./videos.route");
const schemesRoute = require("./schemes.route");
const policiesRoute = require("./policies.route");
const boardAndCommitteesRoute = require("./boardAndCommittees.route");
const disclousersRoute = require("./disclousers.route");
const storeLocatorRoute = require("./storeLocator.route");
const testimonialsRoute = require("./testimonials.route");
const homeBannerRoute = require("./homeBanner.route");
const categoryRoute = require("./category.route");
const genderRoute = require("./gender.route");
const homeCMSContentRoute = require("./homeCMSContent.route");
const metalRoute = require("./metal.route");
const productRoute = require("./product.route");
const mainBrandsRoute = require("./brand.route");
const pageWiseContentRoute = require("./pageWiseContent.route");
const pageWisefaqRoute = require("./pageWiseFAQ.route");
const goldRateRoute = require("./goldRate.route");
const homeBannerTop = require("./homeBannerTop.route");
//Report routes
const contactRoute = require("./contact.route");
const newsLetterRoute = require("./newsLetter.route");
const productInquiryRoute = require("./productInquiry.route");
const uploadRoute = require("./upload.route");
const importExportRoute = require("./importExport.route");
const sitemapRoute = require("./sitemap.route");
const pageRoute = require("./page.route");
const userTypeRoute = require("./userType.route");
const permissionRoute = require("./permission.route");
const cityRoute = require("./city.route");
const dashboardRoute = require("./dashboard.route");
const EventRoute = require("./event.route");
const AutoGenerateTitle=require("./autoGenerate.route")
const InstaFeed=require("./instaFeed.route")
// Use the routes
router.use("/admin", adminRoute);
router.use("/menu", menuRoute);
router.use("/cms", cmsRoute);
router.use("/banner", bannerRoute);
router.use("/emailSetting", emailSettingRoute);
router.use("/websiteSetting", websiteSettingRoute);
router.use("/certificates", certificateRoute);
router.use("/storeLocator", storeLocatorRoute);
router.use("/videos", videosRoute);
router.use("/schemes", schemesRoute);
router.use("/policies", policiesRoute);
router.use("/boardAndCommittees", boardAndCommitteesRoute);
router.use("/disclousers", disclousersRoute);
router.use("/testimonials", testimonialsRoute);
router.use("/contact", contactRoute);
router.use("/newsLetter", newsLetterRoute);
router.use("/productInquiry", productInquiryRoute);
router.use("/homeBanner", homeBannerRoute);
router.use("/homeBannertop", homeBannerTop);
router.use("/category", categoryRoute);
router.use("/gender", genderRoute);
router.use("/pageContent", homeCMSContentRoute);
router.use("/metal", metalRoute);
router.use("/product", productRoute);
router.use("/brands", mainBrandsRoute);
// router.use("/pageWiseContent", pageWiseContentRoute);
router.use("/pageWiseFAQ", pageWisefaqRoute);
router.use("/upload", uploadRoute);
router.use("/importExport", importExportRoute);
router.use("/goldRate", goldRateRoute);
router.use("/sitemap", sitemapRoute);
router.use("/page", pageRoute);
router.use("/userType", userTypeRoute);
router.use("/permission", permissionRoute);
router.use("/city", cityRoute);
router.use("/dashboard", dashboardRoute);
router.use("/event", EventRoute);
router.use("/generate",AutoGenerateTitle)
router.use("/instagram",InstaFeed)
module.exports = router;
