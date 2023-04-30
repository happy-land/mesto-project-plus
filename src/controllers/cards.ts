/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
import { NextFunction, Request, Response } from 'express';
import { RequestCustom } from '../types'; // временное решение
import card from '../models/card';

export const getCards = (req: Request, res: Response) => card
  .find({})
  .then((cards) => res.send({ data: cards }))
  .catch((err) => res.status(500).send({ message: err.message }));

export const createCard = (req: RequestCustom, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  return card
    .create({ name, link, owner: req.user?._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(err);
      } else {
        next(err);
      }
    });
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => card
  .findByIdAndDelete(req.params.cardId)
  .then((card) => {
    if (!card) {
      return Promise.reject(new Error('Карточка не найдена'));
    }
    res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(err);
    } else {
      next(err);
    }
  });

export const likeCard = (req: RequestCustom, res: Response) => card
  .findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user?._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
  .then((card) => {
    if (!card) {
      return Promise.reject(new Error('Карточка не найдена'));
    }
    res.send({ data: card });
  })
  .catch((err) => res.status(500).send({ message: err.message }));

export const dislikeCard = (req: RequestCustom, res: Response) => card
  .findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } }, // убрать _id из массива
    { new: true },
  )
  .then((card) => {
    if (!card) {
      return Promise.reject(new Error('Карточка не найдена'));
    }
    res.send({ data: card });
  })
  .catch((err) => res.status(500).send({ message: err.message }));
