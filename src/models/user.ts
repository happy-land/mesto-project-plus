/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { defaultUser } from '../utils/constants';
import UnauthorizedError from '../errors/unauthorized-err';

export interface IUser {
  name?: string;
  about?: string;
  avatar?: string;
  email: string;
  password: string;
}

export interface IUserModel extends mongoose.Model<IUser> {
  // eslint-disable-next-line max-len
  findUserByCredentials: (email: string, password: string) => Promise<mongoose.Document<unknown, any, IUser>>
}

const userSchema = new Schema<IUser, IUserModel>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: defaultUser.name,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: defaultUser.about,
  },
  avatar: {
    type: String,
    default: defaultUser.avatar,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }

          return user;
        });
    });
});

export default mongoose.model<IUser, IUserModel>('user', userSchema);
