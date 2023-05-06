import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RequestCustom } from '../types';
import User from '../models/user';
import NotFoundError from '../errors/not-found-err';
import InvalidDataError from '../errors/invalid-data-err';
import { tokenExpireTime } from '../utils/constants';
import ConflictError from '../errors/conflict-err';

export const getUsers = (req: Request, res: Response, next: NextFunction) => User
  .find({})
  .then((users) => res.send({ data: users }))
  .catch((err) => next(err));

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  return User
    .findById(userId)
    .then((user) => {
      if (user) {
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
    .then((hash) => User
      .create({
        name,
        about,
        avatar,
        email,
        password: hash,
      }))
    .then(({
      // eslint-disable-next-line no-shadow
      name, about, avatar, email, _id,
    }) => {
      res.send({
        data: {
          name, about, avatar, email, _id,
        },
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с данным email уже зарегистрирован'));
      } else if (err instanceof mongoose.Error.ValidationError) {
        next(new InvalidDataError('Переданы некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};

export const updateUser = (req: RequestCustom, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  return User
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
      next(err);
    });
};

export const updateAvatar = (req: RequestCustom, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  return User
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
      if (err instanceof mongoose.Error.ValidationError) {
        next(new InvalidDataError('Переданы некорректные данные при обновлении пользователя'));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new InvalidDataError('_id пользователя невалиден'));
      } else {
        next(err);
      }
    });
};

export const login = (req: RequestCustom, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: tokenExpireTime });
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

export const getUser = (req: RequestCustom, res: Response, next: NextFunction) => User
  .findById(req.user?._id)
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь по указанному _id не найден.');
    }
    res.send({ data: user });
  })
  .catch((err) => {
    next(err);
  });
