const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const app = express();
require("./config/connection");
const cors = require("cors");
app.use(express.static(path.join(__dirname, "public")));
app.use("/upload", express.static(path.join(__dirname, "upload")));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(cors());
app.use("/api", require("./routes/index.route"));
app.use("/api/menu", express.static(path.join(__dirname, "public", "menu")));
app.use("/cms", express.static(path.join(__dirname, "public/cms")));
app.use("/pageContent", express.static(path.join(__dirname, "public/pageContent")));
app.use("/boxImages", express.static(path.join(__dirname, "public/boxImages")));
app.use("/pageWiseContent", express.static(path.join(__dirname, "public/pageWiseContent")));
app.use("/productWiseContent", express.static(path.join(__dirname, "public/productWiseContent")));
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Kalamandir Jewellers" });
});
const PORT = process.env.PORT || 7171;
app.listen(PORT, (error) => {
  if (error) {
    console.log(error.message);
  } else {
    console.log(`Server is Listening at port ${PORT}`);
  }
});
