const express = require('express');
const router = express.Router();
const ToughtsController = require('../controllers/ToughtsController');
const checkAuth = require('../helpers/auth').checkAuth;

router.get('/', ToughtsController.showToughts);
router.get('/dashboard', checkAuth, ToughtsController.showDashboard);
router.get('/add', checkAuth, ToughtsController.addTought);
router.post('/add', checkAuth, ToughtsController.addToughtSave);

module.exports.toughtsRoutes = router;
