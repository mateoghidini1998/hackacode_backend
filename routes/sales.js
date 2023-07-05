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

router.post('/', protect, authorizeEmployee('employee'), createSale);
router.get('/', protect, getSales);
router.get('/total', protect, getTotalSales);
router.get('/total-sales-by-date', protect, getTotalSalesByDate);
router.get('/:id', protect, authorizeEmployee('employee'), protect, getSale);
router.put('/:id', protect, authorizeEmployee('employee'), protect, updateSale);
router.delete(
  '/:id',
  protect,
  authorizeEmployee('employee'),
  protect,
  deleteSale
);

module.exports = router;
