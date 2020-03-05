import { ErrorBase } from './baseErrors';
import { Status400BadRequest } from '../errorCodes';

export class BadRequestError extends ErrorBase {

  public constructor(context: core.IContext, error: any) {
    super(context);
    this.originalError = error;
  }
}
BadRequestError.prototype.statusCode = Status400BadRequest;
