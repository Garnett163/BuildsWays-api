require('dotenv').config();

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.PROD === 'production' ? process.env.JWT_SECRET : 'dev-secret';

const corsOptions = {
  origin: ['http://localhost:3001'],
  credentials: true,
};

module.exports = {
  PORT,
  JWT_SECRET,
  corsOptions,
};
