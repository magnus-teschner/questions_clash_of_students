const express = require('express');
const JWTController = require('../controllers/jwtController');
const router = express.Router();

router.post('/jwt', JWTController.generateToken);

module.exports = router;
