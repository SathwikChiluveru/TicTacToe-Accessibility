const express = require('express');
const playerController =  require('../controllers/Player.controller');
const router = express.Router();

router.post('/create', playerController.createPlayer );
router.post('/update', playerController.updatePlayerHistory);
router.get('/:name/history', playerController.getPlayerHistory);

module.exports = router;
