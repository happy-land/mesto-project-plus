export const ERROR_CODE_INVALID_DATA: number = 400;
export const ERROR_CODE_NOT_FOUND: number = 404;
export const ERROR_CODE_DEFAULT: number = 500; // internal server error
export const ERROR_CODE_UNAUTHORIZED: number = 401;
export const ERROR_CODE_FORBIDDEN: number = 403;
export const ERROR_CODE_CONFLICT: number = 409;
export const STATUS_CODE_CREATED: number = 201;

export const defaultUser: { name: string, about: string, avatar: string } = {
  name: 'Жак-Ив Кусто',
  about: 'Исследователь',
  avatar: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
};

export const tokenExpireTime: string = '7d';

export const linkRegexp: RegExp = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;
