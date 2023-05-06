import express from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import router from './routes';
import { requestLogger, errorLogger } from './middlewares/logger';
import errorsHandler from './middlewares/errors';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import { createUserValidator, loginValidator } from './utils/validators';
import NotFoundError from './errors/not-found-err';

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(requestLogger);

app.post('/signin', loginValidator, login);
app.post('/signup', createUserValidator, createUser);

app.use(auth);

app.use(router);

app.use(errors());

app.use(errorLogger);

app.use((_, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorsHandler);

app.listen(PORT, () => {});
