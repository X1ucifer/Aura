const Router = require('express').Router();
const {signup} = require('../controllers/auth.js');
Router.post('/signup',signup);
module.exports = Router;