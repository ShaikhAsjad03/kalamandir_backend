const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGO_URI, {
  autoIndex: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connection established successfully");
});

mongoose.connection.on("error", () => {
  console.log("Mongoose connection default error");
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose default connection disconnected");
});

process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log("Connection close successfully");
    process.exit(0);
  });
});
