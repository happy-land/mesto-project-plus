/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { RequestCustom } from '../types'; // временное решение
import user from '../models/user';
import NotFoundError from '../errors/not-found-err';
import InvalidDataError from '../errors/invalid-data-err';
import UnauthorizedError from '../errors/unauthorized-err';

export const getUsers = (req: Request, res: Response, next: NextFunction) => user
  .find({})
  .then((users) => res.send({ data: users }))
  .catch((err) => next(err));

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  return user
    .findById(userId)
    // eslint-disable-next-line no-shadow
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidDataError('_id пользователя невалиден'));
      } else {
        next(err);
      }
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const
    {
      name,
      about,
      avatar,
      email,
      password,
    } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash) => user
      .create({
        name,
        about,
        avatar,
        email,
        password: hash,
      }))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidDataError('Переданы некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};

export const updateUser = (req: RequestCustom, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  return user
    .findByIdAndUpdate(
      req.user?._id,
      {
        name,
        about,
      },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidDataError('Переданы некорректные данные при обновлении пользователя'));
      }
      if (err.name === 'CastError') {
        next(new InvalidDataError('_id пользователя невалиден'));
      }
      next(err);
    });
};

export const updateAvatar = (req: RequestCustom, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  return user
    .findByIdAndUpdate(
      req.user?._id,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidDataError('Переданы некорректные данные при обновлении пользователя'));
      }
      if (err.name === 'CastError') {
        next(new InvalidDataError('_id пользователя невалиден'));
      }
      next(err);
    });
};

export const login = (req: RequestCustom, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return user.findOne({ email })
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      // res.send({ data: user });
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      // аутентификация успешна
      res.send({ message: 'Всё верно!' });
    })
    .catch((err) => {
      next(err);
    });
};
