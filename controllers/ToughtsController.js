const Tought = require('../models/Tought');
const User = require('../models/User');
const { Op } = require('sequelize');

module.exports = class ToughtsController {
  static async showToughts(req, res) {
    let search = '';
    if (req.query.search) {
      search = req.query.search;
    }

    let order = 'DESC';
    if (req.query.order === 'old') {
      order = 'ASC';
    }

    const toughtsData = await Tought.findAll({
      include: User,
      where: { title: { [Op.like]: `%${search}%` } },
      order: [['createdAt', order]],
    });

    const toughts = toughtsData.map((result) => result.get({ plain: true }));
    const { length } = toughts;

    res.render('toughts/home', { toughts, search, length });
  }

  static async showDashboard(req, res) {
    const id = req.session.userid;

    const user = await User.findOne({
      where: { id },
      include: Tought,
      plain: true,
    });

    const toughts = user.Toughts.map((tought) => tought.dataValues);

    res.render('toughts/dashboard', { toughts });
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

  static async removeTought(req, res) {
    const { id } = req.body;
    const UserId = req.session.userid;

    try {
      await Tought.destroy({ where: { id, UserId }, raw: true });

      req.flash('msg', 'Pensamento removido com sucesso');

      req.session.save(() => {
        res.redirect('/toughts/dashboard');
      });
    } catch (error) {
      console.log('Erro ao remover', error);
    }
  }

  static async editTought(req, res) {
    const { id } = req.params;

    const tought = await Tought.findOne({ where: { id }, raw: true });

    res.render('toughts/edit', { tought });
  }

  static async editToughtSave(req, res) {
    const { id, title } = req.body;

    try {
      await Tought.update({ title }, { where: { id } });

      req.flash('msg', 'Pensamento atualizado');

      req.session.save(() => {
        return res.redirect('/toughts/dashboard');
      });
    } catch (err) {
      console.log('Erro ao atualizar pensamento', err);
    }
  }
};
