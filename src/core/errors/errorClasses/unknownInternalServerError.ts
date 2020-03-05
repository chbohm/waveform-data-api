import { InternalServerErrorError } from './internalServerError';

export class UnknownInternalServerError extends InternalServerErrorError {
    constructor(context: core.IContext, body: any, statusCode: number) {
      super(context, body);
      this.message = 'A server error ocurred';
      this.statusCode = statusCode;
    }
  }
