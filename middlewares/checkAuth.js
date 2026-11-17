module.exports = function checkAuth(req, res, next) {
  if (!req.session.user) {
    req.session.flash = { type: 'warning', message: 'Сначала войдите в аккаунт, чтобы открыть эту страницу.' };
    return res.redirect('/logreg');
  }
  next();
};
