const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const protectRoute = asyncHandler(async (req, res, next) => {
  try {
    const token = await req.cookies.token;

    if (token) {
      const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);

      const user = await userModel
        .findById({ _id: verified.userId })
        .select("-password");
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(401);
        throw new Error("Not a valid token.");
      }
    } else {
      res.status(401);
      throw new Error("Not authorized,please login.");
    }
  } catch (error) {
    res.status(401);
    throw new Error("User Not signed In.");
  }
});
module.exports = protectRoute;
