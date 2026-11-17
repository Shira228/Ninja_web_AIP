require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const createMenu = require('./middlewares/createMenu');

const app = express();
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ninja_world';

mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB: соединение установлено'))
  .catch((error) => console.error('MongoDB connection error:', error.message));

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  name: 'ninja.sid',
  secret: process.env.SESSION_SECRET || 'development-only-change-me',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: mongoUri, collectionName: 'sessions' }),
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24
  }
}));

app.use((req, res, next) => {
  req.session.counter = (req.session.counter || 0) + 1;
  res.locals.user = req.session.user || null;
  res.locals.visitCounter = req.session.counter;
  res.locals.currentPath = req.path;
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;
  next();
});
app.use(createMenu);
app.use('/', indexRouter);
app.use('/', authRouter);

app.use((req, res) => res.status(404).render('error', {
  title: 'Страница не найдена',
  message: 'Кажется, этот путь скрыт в тумане.'
}));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).render('error', {
    title: 'Ошибка',
    message: process.env.NODE_ENV === 'production' ? 'Что-то пошло не так.' : err.message
  });
});

module.exports = app;
