require('dotenv').config();

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.PROD === 'production' ? process.env.JWT_SECRET : 'dev-secret';

const corsOptions = {
  origin: ['http://localhost:5173'],
  credentials: true,
};

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BuildsWays API',
      version: '1.0.0',
      description: 'Online store',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

module.exports = {
  PORT,
  JWT_SECRET,
  corsOptions,
  swaggerOptions,
};
