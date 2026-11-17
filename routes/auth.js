const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const User = require('../models/User').User;
const checkUser = require('../middlewares/checkUser');

router.get('/logreg', (req, res) => {
  if (req.session.user) return res.redirect('/profile');
  res.render('logreg', { title: 'Вход и регистрация', error: null });
});

router.post('/logreg', async (req, res, next) => {
  try {
    const username = String(req.body.username || '').trim();
    const password = String(req.body.password || '');
    if (!/^[\p{L}\p{N}_-]{3,24}$/u.test(username) || password.length < 6) {
      return res.status(400).render('logreg', {
        title: 'Вход и регистрация',
        error: 'Имя: 3–24 символа (буквы, цифры, _ или -). Пароль: минимум 6 символов.'
      });
    }
    let user = await checkUser(username, password);
    if (!user) {
      const exists = await User.findOne({ username });
      if (exists) {
        return res.status(401).render('logreg', { title: 'Вход и регистрация', error: 'Неверный пароль.' });
      }
      const salt = crypto.randomBytes(16).toString('hex');
      const hashedPassword = crypto.scryptSync(password, salt, 64).toString('hex');
      user = await User.create({ username, salt, hashedPassword });
    }
    req.session.user = { id: user._id.toString(), username: user.username };
    req.session.flash = { type: 'success', message: `Добро пожаловать, ${user.username}!` };
    res.redirect('/profile');
  } catch (error) {
    if (error.code === 11000) return res.status(409).render('logreg', { title: 'Вход и регистрация', error: 'Это имя уже занято.' });
    next(error);
  }
});

router.post('/logout', (req, res, next) => {
  req.session.destroy((error) => {
    if (error) return next(error);
    res.clearCookie('ninja.sid');
    res.redirect('/');
  });
});

module.exports = router;
