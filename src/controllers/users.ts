/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
import { NextFunction, Request, Response } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import bcrypt from 'bcryptjs';
// eslint-disable-next-line import/no-extraneous-dependencies
import jwt from 'jsonwebtoken';
import { RequestCustom } from '../types';
import user from '../models/user';
import NotFoundError from '../errors/not-found-err';
import InvalidDataError from '../errors/invalid-data-err';
import UnauthorizedError from '../errors/unauthorized-err';
import { tokenExpireTime } from '../utils/constants';

export const getUsers = (req: Request, res: Response, next: NextFunction) => user
  .find({})
  .then((users) => res.send({ data: users }))
  .catch((err) => next(err));

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  return user
    .findById(userId)
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

  return user.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: tokenExpireTime });
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

export const getUser = (req: RequestCustom, res: Response, next: NextFunction) => user
  .findById(req.user?._id)
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь по указанному _id не найден.');
    }
    res.send({ data: user });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new InvalidDataError('_id пользователя невалиден???'));
    }
    next(err);
  });
