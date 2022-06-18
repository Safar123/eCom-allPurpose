const express = require('express');
const { signUpUser, logInUser } = require('../controller/authController');
const router = express.Router();

router.route('/newuser').post(signUpUser);
router.route('/login').post(logInUser);
module.exports= router;