const express = require('express');

const router = express.Router();

const { 
    register,
    getUsers,
    getUser,
    updateUser,
    deleteUser   
} = require('../controllers/auth');

router.post('/register', register);
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);


module.exports = router;