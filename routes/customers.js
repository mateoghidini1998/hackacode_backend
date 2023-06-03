const express = require('express');
const router = express.Router();


const {
    register,
    getCustomers,
    getCustomer,
    updateCustomer,
    deleteCustomer
} = require('../controllers/customers');

const { protect } = require('../middleware/auth');


router.post('/register', protect, register);
router.get('/', protect, getCustomers);
router.get('/:id', protect, getCustomer);
router.put('/:id', protect, updateCustomer);
router.delete('/:id', protect, deleteCustomer);

module.exports = router;