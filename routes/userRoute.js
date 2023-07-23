const express = require("express");
const userController = require("../controllers/userController");
const protectRoute = require("../middleWare/authMiddleware");
const router = express.Router();

// Generate Router.

router.post("/register", userController.userRegistation);
router.post("/login", userController.userLogin);
router.get("/logout", userController.userLogout);
router.patch("/update-password", userController.userUpdatePassword);
router.get("/loggedin", userController.loggedinStatus);
router.post("/forgote-password", userController.forgotePassword);

// user route and protectedRoute
router.get("/getuser", protectRoute, userController.getUser);
router.patch("/updateuser", protectRoute, userController.updateUser);

module.exports = router;
