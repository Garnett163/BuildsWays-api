require('dotenv').config();
const express = require('express');
const { errors } = require('celebrate');
const cookies = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
// const limiter = require('./middlewares/rateLimit');
const errorHandler = require('./middlewares/errorHandler');
// const router = require('./routes');
const sequelize = require('./db');
const models = require('./models/models');
const { PORT, corsOptions } = require('./utils/config');

const app = express();

const { requestLogger, errorLogger } = require('./middlewares/logger');

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

app.use(cors(corsOptions));
app.use(helmet());
// app.use(limiter);
app.use(cookies());
app.use(express.json());
app.use(requestLogger);

// app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

start();
