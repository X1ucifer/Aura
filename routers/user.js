const Router = require('express').Router();
const {signup, login} = require('../controllers/auth.js');
Router.post('/signup',signup);
Router.post('/login',login);
module.exports = Router;