const { Router } = require("express");

const { registerHandler, loginHandler, handleForgetPassword,
     handleResetPassword } = require("../controllers/userController");

const router = new Router();


router.post("/register", registerHandler);

router.post("/login", loginHandler);

router.post('/forget-password', handleForgetPassword)

router.post('/reset-password/:token', handleResetPassword)


module.exports = router;
