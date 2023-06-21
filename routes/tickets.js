const express = require('express');
const router = express.Router();

const {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  deleteTicket,
} = require('../controllers/tickets');

const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/auth');

router.post('/create', protect, createTicket);
router.get('/', protect, getTickets);
router.get('/:id', protect, getTicket);
router.put('/:id', protect, updateTicket);
router.delete('/:id', protect, deleteTicket);

module.exports = router;
