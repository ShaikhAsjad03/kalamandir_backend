const jwt = require("jsonwebtoken");
const adminSchema = require("../models/admin.model");
require("dotenv").config();

exports.verifyTokenAdmin = async (req, res, next) => {
  try {
    let token =
      req.body?.token ||
      req.query?.token ||
      req.headers["x-access-token"] ||
      req.headers.authorization;

    if (!token) {
      return res.status(400).send({
        message: "Token is required",
        isSuccess: false,
      });
    }

    // Handle "Bearer <token>" or raw token
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    jwt.verify(token, process.env.ADMIN_TOKEN_KEY, async (error, authData) => {
      if (error) {
        return res.status(409).send({
          error: error.message,
          message: "Invalid token",
          isSuccess: false,
        });
      }

      const admin = await adminSchema.findById(authData.id);
      if (!admin) {
        return res.status(400).send({
          message: "Admin not found. Invalid token.",
          isSuccess: false,
        });
      }

      req.admin = admin;
      next();
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};
