const express = require('express');
const router = express.Router();

const {
  registerGame,
  getGames,
  uploadPhoto,
  updateGame,
  deleteGame,
  getGame,
  mostTickets,
  ticketsSoldByDate,
  ticketsByAGame,
} = require('../controllers/games');

const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/auth');

router.post('/register', protect, authorize('admin'), registerGame);
router.get('/', protect, getGames);
router.get('/most-tickets', mostTickets);
router.get('/:id/tickets-by-game', ticketsByAGame);
router.get('/tickets-sold-by-date', ticketsSoldByDate);
router.put('/:id/photo', protect, uploadPhoto);
router.delete('/:id', protect, authorize('admin'), deleteGame);
router.put('/:id', protect, authorize('admin'), updateGame);
router.get('/:id', protect, getGame);

module.exports = router;
