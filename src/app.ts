import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users';
import user from "./models/user";
import { RequestCustom } from 'types';

const { PORT = 3000, BASE_PATH } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req: Request, res:Response, next: NextFunction) => {
  const reqCustom = req as RequestCustom;
  reqCustom.user = {
    _id: '644ceaeea7bbdebd1d185820' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/users', usersRouter);

app.listen(PORT, () => {
  console.log('Ссылка на сервер: ', PORT);
});