const Tought = require('../models/Tought');
const User = require('../models/User');

module.exports = class ToughtsController {
  static showToughts(req, res) {
    res.render('toughts/home');
  }

  static showDashboard(req, res) {
    res.render('toughts/dashboard');
  }

  static addTought(req, res) {
    res.render('toughts/create');
  }

  static async addToughtSave(req, res) {
    const { title } = req.body;
    const UserId = req.session.userid;

    try {
      await Tought.create({ title, UserId });
      req.flash('msg', 'Pensamento criado');

      req.session.save(() => {
        res.redirect('/toughts/dashboard');
      });
    } catch (error) {
      console.log(`Ocorreu um erro: ${error}`);
    }
  }
};
