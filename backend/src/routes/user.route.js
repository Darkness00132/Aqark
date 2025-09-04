const router = require("express").Router();
const userContoller = require("../controller/user.controller");
const auth = require("../middlewares/auth");

router.post("/signup", userContoller.signup);

router.post("/login", userContoller.login);

router.get("/profile", auth, userContoller.getProfile);

router.get("/verifyEmail", userContoller.verifyEmail);

router.post("/forgetPassword", userContoller.forgetPassword);

router.post("/resetPassword", userContoller.resetPassword);

router.delete("/logout", auth, userContoller.logout);

module.exports = router;
