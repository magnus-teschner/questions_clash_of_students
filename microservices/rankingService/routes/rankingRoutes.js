const express = require('express');
const RankingController = require('../controllers/rankingController');

const router = express.Router();

router.get('/ranking', RankingController.getRanking);

module.exports = router;
