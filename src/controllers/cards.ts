/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
import { NextFunction, Request, Response } from 'express';
import { RequestCustom } from '../types'; // временное решение
import card from '../models/card';
import NotFoundError from '../errors/not-found-err';
import InvalidDataError from '../errors/invalid-data-err';

export const getCards = (req: Request, res: Response, next: NextFunction) => card
  .find({})
  .then((cards) => res.send({ data: cards }))
  .catch((err) => next(err));

export const createCard = (req: RequestCustom, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  return card
    .create({ name, link, owner: req.user?._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidDataError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => card
  .findByIdAndDelete(req.params.cardId)
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }
    res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new InvalidDataError('_id карточки невалиден'));
    } else {
      next(err);
    }
  });

export const likeCard = (req: RequestCustom, res: Response, next: NextFunction) => card
  .findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user?._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }
    res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new InvalidDataError('_id карточки невалиден'));
    } else {
      next();
    }
  });

export const dislikeCard = (req: RequestCustom, res: Response, next: NextFunction) => card
  .findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } }, // убрать _id из массива
    { new: true },
  )
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }
    res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new InvalidDataError('_id карточки невалиден'));
    } else {
      next();
    }
  });
