import { ErrorBase } from './baseErrors';
import { Status503ServiceUnavailable } from '../errorCodes';

export class ServiceUnavailableError extends ErrorBase {
  public statusCode: number;
  public message: string;
  public constructor(context: core.IContext, message: string) {
    super(context);
    this.message = message;
  }
}
ServiceUnavailableError.prototype.statusCode = Status503ServiceUnavailable;
