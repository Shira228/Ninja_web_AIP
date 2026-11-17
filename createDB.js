require('dotenv').config();
const mongoose = require('mongoose');
const async = require('async');
const { Ninja } = require('./models/ninja');
const data = require('./data').data;

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ninja_world';
mongoose.connect(uri);

async.series([
  (callback) => mongoose.connection.once('open', callback),
  (callback) => mongoose.connection.dropDatabase(callback),
  (callback) => Ninja.insertMany(data).then(() => callback()).catch(callback),
  (callback) => Ninja.collection.createIndex({ nick: 1 }, { unique: true }).then(() => callback()).catch(callback)
], (error) => {
  if (error) console.error(error);
  else console.log(`База ninja_world заполнена: ${data.length} записей, индекс nick создан.`);
  mongoose.disconnect();
});
