const express = require("express");

const router = express.Router();
const { signup,login, current_user } = require('../Controllers/user_controller/auth');


router.post('/signup',signup);
router.post('/login',login);



module.exports = router;
