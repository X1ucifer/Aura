const express = require("express");

const router = express.Router();
const { signup,login, current_user } = require('../controllers/user_controller/auth.js');


router.post('/signup',signup);
router.post('/login',login);
router.post('/get',current_user);



module.exports = router;
