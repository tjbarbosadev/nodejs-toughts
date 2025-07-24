const express = require('express');
const router = express.Router();
const ToughtsController = require('../controllers/ToughtsController');
const checkAuth = require('../helpers/auth').checkAuth;

router.get('/dashboard', checkAuth, ToughtsController.showDashboard);
router.get('/add', checkAuth, ToughtsController.addTought);

router.get('/edit/:id', checkAuth, ToughtsController.editTought);
router.post('/edit', checkAuth, ToughtsController.editToughtSave);

router.post('/add', checkAuth, ToughtsController.addToughtSave);
router.post('/remove', checkAuth, ToughtsController.removeTought);

router.get('/', ToughtsController.showToughts);

module.exports.toughtsRoutes = router;
