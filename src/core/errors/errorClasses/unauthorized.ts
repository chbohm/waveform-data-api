import { ErrorBase } from './baseErrors';
import { Status401Unauthorized } from '../errorCodes';

export class UnauthorizedError extends ErrorBase {
  public statusCode: number;
  public message: string;
  public constructor(context: core.IContext, message: string) {
    super(context);
    this.message = message;
  }
}
UnauthorizedError.prototype.statusCode = Status401Unauthorized;
