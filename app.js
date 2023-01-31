require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/limiter');
const { devMongoUrl, devOriginUrl, devPort } = require('./utils/config');

const { NODE_ENV, MONGO_URL } = process.env;

const { PORT = NODE_ENV === 'prodaction' ? 3000 : devPort } = process.env;

const corsOptions = {
  origin: NODE_ENV === 'prodaction' ? 'https://movies-ger.nomoredomains.club' : devOriginUrl,
  credentials: true,
  optionSuccessStatus: 200,
};

const app = express();

app.use(limiter);

app.use(helmet());

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(NODE_ENV === 'prodaction' ? MONGO_URL : devMongoUrl, { useNewUrlParser: true });

app.use(requestLogger);

app.use(cors(corsOptions));

app.use('/', require('./routes/index'));

app.use(errorLogger);

app.use(errors());
app.use(require('./middlewares/errors'));

app.listen(PORT, () => {
  console.log(`App listening on port  ${PORT}`);
});
