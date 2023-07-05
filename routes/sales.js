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
const { authorizeEmployee } = require('../middleware/auth');

router.post('/', protect, authorizeEmployee('manager'), createSale);
router.get('/', protect, authorizeEmployee('manager'), getSales);
router.get('/total', protect, getTotalSales);
router.get('/total-sales-by-date', protect, getTotalSalesByDate);
router.get('/:id', protect, authorizeEmployee('manager'), protect, getSale);
router.put('/:id', protect, authorizeEmployee('manager'), protect, updateSale);
router.delete(
  '/:id',
  protect,
  authorizeEmployee('manager'),
  protect,
  deleteSale
);

module.exports = router;
