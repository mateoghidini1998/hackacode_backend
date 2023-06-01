const express = require('express');

const router = express.Router();

const { 
    register,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    login   
} = require('../controllers/auth');

router.post('/register', register);
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/login', login);


module.exports = router;