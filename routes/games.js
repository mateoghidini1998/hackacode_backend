const express = require('express');
const router = express.Router();


const {
    registerGame,
    getGames
} = require('../controllers/games');

const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/auth');

router.post('/register', protect, authorize('admin'), registerGame);
router.get('/', getGames);

module.exports = router;