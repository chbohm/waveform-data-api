import { ErrorBase } from './baseErrors';
import { Status500InternalServerError } from '../errorCodes';

export class InternalServerErrorError extends ErrorBase {
  public statusCode: number;
  public message: string;
  public constructor(context: core.IContext, message: string) {
    super(context);
    this.message = message;
  }
}
InternalServerErrorError.prototype.statusCode = Status500InternalServerError;
