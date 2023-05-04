import { ERROR_CODE_UNAUTHORIZED } from '../utils/constants';

class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = ERROR_CODE_UNAUTHORIZED;
  }
}

export default UnauthorizedError;
