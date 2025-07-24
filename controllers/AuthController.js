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
  static registerPost(req, res) {
    const { name, email, password, cpassword } = req.body;

    console.log(name, email, password, cpassword);

    if (password !== cpassword) {
      req.flash('msg', 'As senhas não conferem');
    }

    res.render('auth/register');
  }
};
