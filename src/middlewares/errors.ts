import { NextFunction, Request, Response } from 'express';
import { ERROR_CODE_DEFAULT } from '../utils/constants';

interface IError extends Error {
  statusCode: number;
}

const errorsHandler = ((err: IError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = ERROR_CODE_DEFAULT, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === ERROR_CODE_DEFAULT
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

export default errorsHandler;
