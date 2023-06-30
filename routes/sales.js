const express = require('express');
const router = express.Router();

const {
  createSale,
  getSales,
  getSale,
  updateSale,
  deleteSale,
} = require('../controllers/sales');

router.post('/', createSale);
router.get('/', getSales);
router.get('/:id', getSale);
router.put('/:id', updateSale);
router.delete('/:id', deleteSale);

module.exports = router;
