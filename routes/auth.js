const express = require('express');

const router = express.Router();

const { 
    register,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    login,
    getMe   
} = require('../controllers/auth');

const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/auth');

router.post('/register', protect, authorize('admin'),register);
router.get('/users', protect, getUsers);
router.get('/users/:id', protect, getUser);
router.put('/users/:id', protect, updateUser);
router.delete('/users/:id', protect, deleteUser);
router.post('/login', login);
router.get('/me', protect, getMe);


module.exports = router;