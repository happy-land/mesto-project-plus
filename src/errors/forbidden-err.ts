import { ERROR_CODE_FORBIDDEN } from '../utils/constants';

class ForbiddenError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = ERROR_CODE_FORBIDDEN;
  }
}

export default ForbiddenError;
