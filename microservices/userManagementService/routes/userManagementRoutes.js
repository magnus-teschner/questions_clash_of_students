const express = require('express');
const UserManagementController = require('../../controllers/userManagementController');

const router = express.Router();

router.get('/accounts/:email', UserManagementController.findIdByEmail);
router.get('/accounts/verify-by-token/:token', UserManagementController.findAccountByToken);


router.put('/accounts/:id/set-verified', UserManagementController.verifyAccount);
router.put('/accounts/:id/password', UserManagementController.updatePassword);


router.post('/accounts', UserManagementController.createAccount);


router.get('/', UserManagementController.getHealth);

module.exports = router;
