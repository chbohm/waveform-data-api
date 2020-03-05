import { Status500InternalServerError, Status400BadRequest } from './errorCodes';
import { ErrorBase } from './errorClasses/baseErrors';

export class EmailFieldError extends ErrorBase {
  public constructor(context: core.IContext, message: string) {
    super(context);
    this.statusCode = Status500InternalServerError;
    this.message = message;
  }
}

export class RequiredFieldError extends ErrorBase {
  public constructor(context: core.IContext, message: string) {
    super(context);
    this.statusCode = Status500InternalServerError;
    this.message = message;
  }
}

export class InactiveUserError extends ErrorBase {
  public constructor(context: core.IContext, message: string) {
    super(context);
    this.statusCode = Status400BadRequest;
    this.message = message;
  }
}

export class InvalidCredentialsError extends ErrorBase {
  public constructor(context: core.IContext, message: string) {
    super(context);
    this.statusCode = Status400BadRequest;
    this.message = message;
  }
}

export class SignInAttemptsExceededError extends ErrorBase {
  public constructor(context: core.IContext, message: string) {
    super(context);
    this.statusCode = Status400BadRequest;
    this.message = message;
  }
}

export class PasswordExpiredError extends ErrorBase {
  public constructor(context: core.IContext, message: string) {
    super(context);
    this.statusCode = Status400BadRequest;
    this.message = message;
  }
}
