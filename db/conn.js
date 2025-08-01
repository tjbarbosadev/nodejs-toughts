const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
);

try {
  sequelize.authenticate();
  console.log('MySql connected');
} catch (err) {
  console.log('Not connected', err);
}

module.exports = sequelize;
