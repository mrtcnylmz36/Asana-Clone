const Moongose = require('mongoose');

const db = Moongose.connection;

db.once('open', () => {
  console.log('DB Bağlantısı başarılı');
});

const connectDB = async () => {
  await Moongose.connect(
    `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  );
};

module.exports = {
  connectDB,
};
