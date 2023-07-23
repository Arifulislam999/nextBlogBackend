const asyncHandler = require("express-async-handler");

class blogController {
  static getAllUser = asyncHandler(async (req, res) => {
    res.status(200).send("Get All Data");
  });
}
module.exports = blogController;
