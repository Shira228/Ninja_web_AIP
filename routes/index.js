const express = require('express');
const router = express.Router();
const asyncLib = require('async');
const { Ninja } = require('../models/ninja');
const checkAuth = require('../middlewares/checkAuth');

router.get('/', async (req, res, next) => {
  try {
    const [featured, techniques] = await Promise.all([
      Ninja.find({ category: 'Персонажи' }).limit(3).lean(),
      Ninja.find({ category: 'Техники' }).limit(3).lean()
    ]);
    res.cookie('ninja_greeting', 'Welcome to the hidden village', { sameSite: 'lax', maxAge: 86400000 });
    res.render('index', { title: 'Ninja World', featured, techniques });
  } catch (error) { next(error); }
});

router.get('/history', (req, res) => res.render('history', { title: 'История ниндзя' }));
router.get('/training', checkAuth, (req, res) => res.render('training', { title: 'Тренировочный зал' }));

router.get('/ninja/:nick', async (req, res, next) => {
  try {
    const ninja = await Ninja.findOne({ nick: req.params.nick }).lean();
    if (!ninja) return res.status(404).render('error', { title: 'Не найдено', message: 'Такого свитка нет в архиве.' });
    res.render('ninja', { title: ninja.title, ninja });
  } catch (error) { next(error); }
});

router.get('/library', async (req, res, next) => {
  try {
    const filter = req.query.category ? { category: req.query.category } : {};
    const ninjas = await Ninja.find(filter).sort({ category: 1, title: 1 }).lean();
    res.render('library', { title: 'Архив ниндзя', ninjas, selectedCategory: req.query.category || '' });
  } catch (error) { next(error); }
});

router.get('/profile', checkAuth, (req, res) => res.render('profile', { title: 'Личный свиток' }));

module.exports = router;
