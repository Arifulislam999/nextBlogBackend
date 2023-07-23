const express = require("express");
const blogController = require("../controllers/blogController");
const router = express.Router();

router.get("/alluser", blogController.getAllUser);
module.exports = router;
