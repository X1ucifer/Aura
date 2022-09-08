const express = require("express");

const router = express.Router();
const { signup,login, current_user } = require('../controllers/user_controller/auth.js');


router.post('/signup',signup);
router.post('/login',login);



module.exports = router;
