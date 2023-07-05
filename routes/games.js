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
const { authorizeEmployee } = require('../middleware/auth');

router.post('/register', protect, authorizeEmployee('employee'), registerGame);
router.get('/', protect, getGames);
router.get('/most-tickets', protect, mostTickets);
router.get('/:id/tickets-by-game', protect, ticketsByAGame);
router.get('/tickets-sold-by-date', protect, ticketsSoldByDate);
router.put('/:id/photo', protect, authorizeEmployee('employee'), uploadPhoto);
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  authorizeEmployee('employee'),
  deleteGame
);
router.put(
  '/:id',
  protect,
  authorize('admin'),
  authorizeEmployee('employee'),
  updateGame
);
router.get('/:id', protect, authorizeEmployee('employee'), getGame);

module.exports = router;
