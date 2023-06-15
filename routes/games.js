const express = require('express');
const router = express.Router();

const { registerGame, getGames, uploadPhoto } = require('../controllers/games');

const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/auth');

router.post('/register', protect, authorize('admin'), registerGame);
router.get('/', getGames);
router.put('/:id/photo', protect, uploadPhoto);

module.exports = router;
