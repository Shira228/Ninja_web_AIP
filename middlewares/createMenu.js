const { Ninja } = require('../models/ninja');

module.exports = async function createMenu(req, res, next) {
  try {
    res.locals.nav = await Ninja.find({}, { _id: 0, title: 1, nick: 1, category: 1 })
      .sort({ category: 1, title: 1 }).lean();
    next();
  } catch (error) {
    next(error);
  }
};
