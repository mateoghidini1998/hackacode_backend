const express = require('express');
const router = express.Router();

const {
    register,
    getCustomers,
    getCustomer,
    updateCustomer,
    deleteCustomer
} = require('../controllers/customers');

router.post('/register', register);
router.get('/', getCustomers);
router.get('/:id', getCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

module.exports = router;