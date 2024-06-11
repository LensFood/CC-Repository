// routes/user.routes.js
const express = require('express');
const users = require('../controllers/user.controller');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

// Register and login routes
router.post('/register', users.registerUser);
router.post('/login', users.loginUser);

// CRUD operations for User
router.post('/', verifyToken, users.createUser);
router.get('/', verifyToken, users.getUser);
router.put('/', verifyToken, users.updateUser);

module.exports = router;
