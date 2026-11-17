require('dotenv').config();
const mongoose = require('mongoose');
const { Ninja } = require('./models/ninja');
(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ninja_world');
    const [count, indexes] = await Promise.all([Ninja.countDocuments(), Ninja.collection.indexes()]);
    console.log({ documents: count, indexes: indexes.map((item) => item.name) });
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
