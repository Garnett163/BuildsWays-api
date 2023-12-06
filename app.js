require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');
const { errors } = require('celebrate');
const cookies = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
// const limiter = require('./middlewares/rateLimit');
const fileUpload = require('express-fileupload');
const errorHandler = require('./middlewares/errorHandler');
const router = require('./routes');
const sequelize = require('./db');
const {
  PORT, corsOptions, helmetOptions, swaggerOptions,
} = require('./utils/config');

const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(swaggerOptions)));

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
app.use(helmet(helmetOptions));
// app.use(limiter);
app.use(cookies());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'images')));
// app.use(express.static(path.resolve(__dirname, 'images/category')));
app.use(fileUpload({}));
app.use(requestLogger);

app.use('/api', router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

start();
