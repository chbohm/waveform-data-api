import { ErrorBase } from './baseErrors';
import { Status404NotFound } from '../errorCodes';

export class NotFoundError extends ErrorBase {
  public statusCode: number;
  public message: string;
  public constructor(context: core.IContext, message: string) {
    super(context);
    this.message = message;
  }
}
NotFoundError.prototype.statusCode = Status404NotFound;
