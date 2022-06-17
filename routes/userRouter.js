const express = require('express');
const { signUpUser } = require('../controller/authController');
const router = express.Router();

router.route('/newuser').post(signUpUser)
module.exports= router;