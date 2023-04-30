/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
import { NextFunction, Request, Response } from 'express';
import { RequestCustom } from '../types'; // временное решение

import user from '../models/user';

export const getUsers = (req: Request, res: Response) => user
  .find({})
  .then((users) => res.send({ data: users }))
  .catch((err) => res.status(500).send({ message: err.message }));

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  return user
    .findById(userId)
    // eslint-disable-next-line no-shadow
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Пользователь не найден'));
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(err);
      } else {
        next(err);
      }
      res.status(500).send({ message: err.message });
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;
  return user
    .create({ name, about, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(err);
      } else {
        next(err);
      }
      if (err.name === 'ValidationError') {
        next(err);
      } else {
        next(err);
      }
      res.status(500).send({ message: err.message });
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
        return Promise.reject(new Error('Пользователь не найден'));
      }
      res.send({ data: user });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
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
        return Promise.reject(new Error('Пользователь не найден'));
      }
      res.send({ data: user });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};
