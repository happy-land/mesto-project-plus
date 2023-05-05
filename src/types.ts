import { Request } from 'express';

export interface RequestCustom extends Request {
  user?: {
    _id: string;
  };
}

export interface IUser {
  name: string,
  about: string,
  avatar: string,
}
