import { BadRequestError } from './badRequest';

export class UnknownBadRequestError extends BadRequestError {
    constructor(context: core.IContext, body: any, statusCode: number) {
      super(context, body);
      this.message = 'A client error ocurred';
      this.statusCode = statusCode;
    }
  }
