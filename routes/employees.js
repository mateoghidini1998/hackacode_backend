const express = require('express');
const router = express.Router();

const {
    /* register, */
    getEmployees,
    getEmployee,
    updateEmployee,
    deleteEmployee
} = require('../controllers/employees');

/* router.post('/register', register); */
router.get('/', getEmployees);
router.get('/:id', getEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

module.exports = router;