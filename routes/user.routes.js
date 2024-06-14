// routes/user.routes.js
const express = require('express');
const users = require('../controllers/user.controller');
const router = express.Router();
const admin = require('firebase-admin');
const verifyToken = require('../middleware/authMiddleware');

// Register and login routes
router.post('/register', users.registUser);
router.post('/login', users.loginUser);

// Route to get user profile
router.get('/profile', verifyToken, async (req, res) => {
    try {
      // Assuming req.uid is set by the verifyToken middleware with the user's UID
      const userRecord = await admin.auth().getUser(req.uid);
      res.status(200).send({ userRecord });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

  router.put('/profile', users.updateProfile);

module.exports = router;
