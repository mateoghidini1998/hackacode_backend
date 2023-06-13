const express = require('express');

const router = express.Router();

const { register, login, getMe } = require('../controllers/auth');

const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/auth');

router.post('/register', protect, authorize('admin'), register);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
