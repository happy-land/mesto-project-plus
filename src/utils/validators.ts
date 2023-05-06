import { celebrate, Joi } from 'celebrate';
import { linkRegexp } from './constants';

export const loginValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2 }),
    password: Joi.string().required(),
  }),
});

export const createUserValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(linkRegexp),
    email: Joi.string().required().email({ minDomainSegments: 2 }),
    password: Joi.string().required(),
  }),
});

export const getUserByIdValidator = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
});

export const updateUserValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

export const updateAvatarValidator = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(linkRegexp),
  }),
});

export const createCardValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(linkRegexp),
  }),
});

export const deleteCardValidator = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
});

export const likeCardValidator = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
});

export const dislikeCardValidator = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
});
