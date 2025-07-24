const User = require('../models/User');
const bcrypt = require('bcryptjs');
module.exports = class AuthController {
  static login(req, res) {
    res.render('auth/login');
  }

  static register(req, res) {
    res.render('auth/register');
  }

  static loginPost(req, res) {
    res.render('auth/login');
  }
  static async registerPost(req, res) {
    const { name, email, password, cpassword } = req.body;

    console.log(name, email, password, cpassword);

    // check passwords
    if (password !== cpassword) {
      req.flash('msg', 'As senhas não conferem');
      return res.render('auth/register', { name, email });
    }

    // check user exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      req.flash('msg', 'Usuário já cadastrado');
      return res.render('auth/register', { name, email });
    }

    // create password
    const salt = bcrypt.genSaltSync(10);
    const hashedPass = bcrypt.hashSync(password, salt);

    const user = {
      name,
      email,
      password: hashedPass,
    };

    try {
      const createdUser = await User.create(user);

      // initialize session
      req.session.userid = createdUser.id;

      req.flash('msg', 'Usuário cadastrado com sucesso!');

      req.session.save(() => {
        res.redirect('/');
      });
    } catch (err) {
      console.log(`Falha no cadastro ${err}`);
    }
  }
};
