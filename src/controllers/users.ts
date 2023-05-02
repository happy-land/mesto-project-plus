/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
import { Request, Response } from 'express';
import { RequestCustom } from '../types'; // временное решение

import user from '../models/user';
import { ERROR_CODE_DEFAULT, ERROR_CODE_INVALID_DATA, ERROR_CODE_NOT_FOUND } from '../utils/constants';

export const getUsers = (req: Request, res: Response) => user
  .find({})
  .then((users) => res.send({ data: users }))
  .catch((err) => res.status(500).send({ message: err.message }));

export const getUserById = (req: Request, res: Response) => {
  const { userId } = req.params;
  return user
    .findById(userId)
    // eslint-disable-next-line no-shadow
    .then((user) => {
      if (!user) {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь не найден' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res.status(ERROR_CODE_DEFAULT).send({ message: err.message });
      }
    });
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  return user
    .create({ name, about, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_INVALID_DATA).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(ERROR_CODE_DEFAULT).send({ message: err.message });
      }
    });
};

export const updateUser = (req: RequestCustom, res: Response) => {
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
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь не найден' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_INVALID_DATA).send({ message: 'Переданы некорректные данные при обновлении пользователя' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
        return;
      }
      res.status(ERROR_CODE_DEFAULT).send({ message: err.message });
    });
};

export const updateAvatar = (req: RequestCustom, res: Response) => {
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
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь не найден' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_INVALID_DATA).send({ message: 'Переданы некорректные данные при обновлении аватара' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
        return;
      }
      res.status(ERROR_CODE_DEFAULT).send({ message: err.message });
    });
};
