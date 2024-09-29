const express = require('express');
const UserManagementController = require('../controllers/userManagementController');

const router = express.Router();

router.get('/accounts/email/:email', UserManagementController.findAccountByEmail);
router.get('/accounts/token/:token', UserManagementController.findAccountByToken);
router.get('/accounts/:user_id/:is-verified', UserManagementController.checkVerification);


router.put('/accounts/:user_id/set-verified', UserManagementController.verifyAccount);
router.put('/accounts/:user_id/password', UserManagementController.updatePassword);
router.put('/accounts/:user_id/token/:token', UserManagementController.setVerificationToken);

router.post('/accounts', UserManagementController.createAccount);


router.get('/', UserManagementController.getHealth);

module.exports = router;
