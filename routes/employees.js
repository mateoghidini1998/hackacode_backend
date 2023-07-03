const express = require('express');
const router = express.Router();

const {
  /* register, */
  getEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeesAndGame,
} = require('../controllers/employees');

const { protect } = require('../middleware/auth');

router.get('/', protect, getEmployees);
router.get('/employees-and-game', protect, getEmployeesAndGame);
router.get('/:id', protect, getEmployee);
router.put('/:id', protect, updateEmployee);
router.delete('/:id', protect, deleteEmployee);

module.exports = router;
