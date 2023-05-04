/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
import { Request, Response } from 'express';
import { RequestCustom } from '../types'; // временное решение
import card from '../models/card';
import { ERROR_CODE_DEFAULT, ERROR_CODE_INVALID_DATA, ERROR_CODE_NOT_FOUND } from '../utils/constants';

export const getCards = (req: Request, res: Response) => card
  .find({})
  .then((cards) => res.send({ data: cards }))
  .catch((err) => res.status(ERROR_CODE_DEFAULT).send({ message: err.message }));

export const createCard = (req: RequestCustom, res: Response) => {
  const { name, link } = req.body;
  return card
    .create({ name, link, owner: req.user?._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {

        res.status(ERROR_CODE_INVALID_DATA).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(ERROR_CODE_DEFAULT).send({ message: err.message });
      }
    });
};

export const deleteCard = (req: Request, res: Response) => card
  .findByIdAndDelete(req.params.cardId)
  .then((card) => {
    if (!card) {
      res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Карточка не найдена' });
      return;
    }
    res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(ERROR_CODE_INVALID_DATA).send({ message: '_id карточки невалиден' });
    } else {
      res.status(ERROR_CODE_DEFAULT).send({ message: err.message });
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
      res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Карточка не найдена' });
      return;
    }
    res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(ERROR_CODE_INVALID_DATA).send({ message: '_id карточки невалиден' });
    } else {
      res.status(ERROR_CODE_DEFAULT).send({ message: err.message });
    }
  });

export const dislikeCard = (req: RequestCustom, res: Response) => card
  .findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } }, // убрать _id из массива
    { new: true },
  )
  .then((card) => {
    if (!card) {
      res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Карточка не найдена' });
      return;
    }
    res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(ERROR_CODE_INVALID_DATA).send({ message: '_id карточки невалиден' });
    } else {
      res.status(ERROR_CODE_DEFAULT).send({ message: err.message });
    }
  });
