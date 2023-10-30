require('dotenv').config();
const express = require('express');
const { errors } = require('celebrate');
const cookies = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
// const limiter = require('./middlewares/rateLimit');
const errorHandler = require('./middlewares/errorHandler');
// const router = require('./routes');
const { PORT, corsOptions } = require('./utils/config');

const app = express();

const { requestLogger, errorLogger } = require('./middlewares/logger');

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

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
