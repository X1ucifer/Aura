const Router = require('express').Router();
const { signup, login, register, verify } = require('../controllers/auth.js');
Router.post('/signup', signup);
Router.post('/signup/register', register)
Router.post('/login', login);
Router.post('/login/verify', verify)
module.exports = Router;