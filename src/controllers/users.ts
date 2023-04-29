import { Request, Response } from "express";
import { RequestCustom } from "types"; // временное решение

import user from "../models/user";

export const getUsers = (req: Request, res: Response) => {
  return user.find({})
    .then(users => res.send({ data: users }))
    .catch(err => res.status(500).send({ message: err.message }))
}

export const getUserById = (req: Request, res: Response) => {
  const { userId } = req.params;
  return user.findById(userId)
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: err.message }))
}

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  return user.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: err.message }))
}

export const updateUser = (req: RequestCustom, res: Response) => {
  const { name } = req.body;
  return user.findByIdAndUpdate(
    req.user?._id,
    { name: name},
    {
      new: true,
      runValidators: true,
      upsert: true
    }
  )
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: err.message }))
}

export const updateAvatar = (req: RequestCustom, res: Response) => {
  const { avatar } = req.body;
  return user.findByIdAndUpdate(
    req.user?._id,
    { avatar: avatar},
    {
      new: true,
      runValidators: true,
      upsert: true
    }
  )
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: err.message }))
}

