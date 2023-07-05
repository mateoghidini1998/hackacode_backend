const express = require('express');
const router = express.Router();

const {
  createSale,
  getSales,
  getSale,
  updateSale,
  deleteSale,
  getTotalSales,
  getTotalSalesByDate,
} = require('../controllers/sales');

const { protect } = require('../middleware/auth');

router.post('/', protect, createSale);
router.get('/', protect, getSales);
router.get('/total', protect, getTotalSales);
router.get('/total-sales-by-date', protect, getTotalSalesByDate);
router.get('/:id', protect, getSale);
router.put('/:id', protect, updateSale);
router.delete('/:id', protect, deleteSale);

module.exports = router;
