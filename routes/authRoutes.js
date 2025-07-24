const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

router.get('/login', AuthController.login);
router.get('/register', AuthController.register);

router.post('/login', AuthController.loginPost);
router.post('/register', AuthController.registerPost);

module.exports.authRoutes = router;
