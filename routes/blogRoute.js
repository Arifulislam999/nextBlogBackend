const express = require("express");
const blogController = require("../controllers/blogController");
const protectRoute = require("../middleWare/authMiddleware");
const router = express.Router();

router.post("/singlepost", protectRoute, blogController.userPostData);
router.get("/loggedinuserpost", protectRoute, blogController.getLoggedUserPost);
router.get("/allpost", blogController.getAllPost);
router.get("/singleuserquery", blogController.getSingleQueryUser);
router.get("/myuserid", protectRoute, blogController.myUserId);
router.patch("/editpost", protectRoute, blogController.singleEditPost);
router.get("/singlepost", protectRoute, blogController.getSinglePost);
router.delete("/delete", protectRoute, blogController.deletePost);
module.exports = router;
