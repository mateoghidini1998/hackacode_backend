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
const { authorizeEmployee } = require('../middleware/auth');

router.post('/create', protect, authorizeEmployee('employee'), createTicket);
router.get('/', protect, getTickets);
router.get('/:id', protect, authorizeEmployee('employee'), getTicket);
router.put('/:id', protect, authorizeEmployee('employee'), updateTicket);
router.delete('/:id', protect, authorizeEmployee('employee'), deleteTicket);

module.exports = router;
