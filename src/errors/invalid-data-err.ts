import { ERROR_CODE_INVALID_DATA } from '../utils/constants';

class InvalidDataError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = ERROR_CODE_INVALID_DATA;
  }
}

export default InvalidDataError;
