const User = require('../models/user.js');

module.exports.renderSignupForm = (req, res) => {
  res.render('users/signup.ejs');
};

module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });

    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash('success', 'Welcome to WanderLust!');
      res.redirect(res.locals.redirectUrl || '/Listing');
    });
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/signup');
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render('users/login.ejs');
};

module.exports.login = (req, res) => {
  req.flash('success', 'Welcome back!');

  // BUG FIX: pehle "req.session.redirectUrl" undefined hone par
  // res.redirect(undefined) chalta tha, ab default "/Listing" hai.
  const redirectUrl = res.locals.redirectUrl || '/Listing';
  delete req.session.redirectUrl;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash('success', 'Successfully logged out!');
    res.redirect('/Listing'); // BUG FIX: pehle "/listings" tha, mount path se match nahi karta tha
  });
};
