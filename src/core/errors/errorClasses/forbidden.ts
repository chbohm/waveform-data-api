import { ErrorBase } from './baseErrors';
import { Status403Forbidden } from '../errorCodes';

export class ForbiddenError extends ErrorBase {
  public statusCode: number;
  public message: string;
  public constructor(context: core.IContext, message: string) {
    super(context);
    this.message = message;
  }
}
ForbiddenError.prototype.statusCode = Status403Forbidden;
