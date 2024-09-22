const express = require('express');
const EmailController = require('../controllers/emailController');

const router = express.Router();

router.post('/send-verification', EmailController.sendVerificationEmail);

router.post('/send-reset-password', EmailController.sendResetPasswordEmail);

module.exports = router;
