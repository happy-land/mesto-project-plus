import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { RequestCustom } from '../types';
import Card from '../models/card';
import NotFoundError from '../errors/not-found-err';
import InvalidDataError from '../errors/invalid-data-err';
import ForbiddenError from '../errors/forbidden-err';
import { STATUS_CODE_CREATED } from '../utils/constants';

export const getCards = (req: Request, res: Response, next: NextFunction) => Card
  .find({})
  .populate(['owner', 'likes'])
  .then((cards) => res.send({ data: cards }))
  .catch((err) => next(err));

export const createCard = (req: RequestCustom, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  return Card
    .create({ name, link, owner: req.user?._id })
    .then((card) => res.status(STATUS_CODE_CREATED).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new InvalidDataError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

export const deleteCard = (req: RequestCustom, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then(async (card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (card.owner.toString() === req.user?._id.toString()) {
        await card.deleteOne();
        res.send({ message: 'Карточка успешно удалена' });
      } else {
        throw new ForbiddenError('Вы можете удалять только свои карточки');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidDataError('_id карточки невалиден'));
      } else {
        next(err);
      }
    });
};

export const likeCard = (req: RequestCustom, res: Response, next: NextFunction) => Card
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

export const dislikeCard = (req: RequestCustom, res: Response, next: NextFunction) => Card
  .findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } },
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
