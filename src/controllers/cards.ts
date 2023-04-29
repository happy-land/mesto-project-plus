import { Request, Response } from "express";
import { RequestCustom } from "types"; // временное решение
import card from "../models/card";

export const getCards = (req: Request, res: Response) => {
  return card.find({})
  .then(cards => res.send({ data: cards }))
  .catch(err => res.status(500).send({ message: err.message }))
}

export const createCard = (req: RequestCustom, res: Response) => {
  console.log(req.user?._id);
  const { name, link } = req.body;
  return card.create({ name, link, owner: req.user?._id })
    .then(card => res.send({ data: card }))
    .catch(err => res.status(500).send({ message: err.message }))
}

export const deleteCard = (req: Request, res: Response) => {
  return card.findByIdAndDelete(req.params.id)
    .then(card => res.send({ data: card }))
    .catch(err => res.status(500).send({ message: err.message }))
}