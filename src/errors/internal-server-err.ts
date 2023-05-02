import { ERROR_CODE_DEFAULT } from '../utils/constants';

class InternalServerError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = ERROR_CODE_DEFAULT; // 500
  }
}

export default InternalServerError;
