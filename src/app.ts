import express from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import { ERROR_CODE_NOT_FOUND } from './utils/constants';
import { requestLogger, errorLogger } from './middlewares/logger';
import errorsHandler from './middlewares/errors';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(requestLogger);

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use(errorLogger);

app.use((_, res) => {
  res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Страница не найдена' });
});

app.use(errorsHandler);

app.listen(PORT, () => {});
