

export function handleError(error: any, response: endpoint.IResponse, nextFunction: endpoint.INextFunction) {
  let basicError: BasicError;
  if (error instanceof BasicError) {
    basicError = error as BasicError;
  } else if (error instanceof Error) {
    basicError = new InternalServerError(error.message, error.stack);
  } else if (error) {
    basicError = new InternalServerError(JSON.stringify(error), error);
  } else {
    basicError = new InternalServerError('Unknown error ');
  }
  response.status(basicError.httpCode).json(basicError);
}

export class BasicError {
  code: string;
  message: string;
  httpCode: number;
  data?: any;
}

export class InternalServerError extends BasicError {
  public constructor(message: string, data?: any) {
    super();
    this.code = 'INTERNAL_SERVER_ERROR';
    this.message = message;
    this.data = data;
    this.httpCode = 500;
  }

}

export class BadRequestError extends BasicError {
  public constructor(message: string, data?: any) {
    super();
    this.code = 'BAD_REQUEST_ERROR';
    this.message = message;
    this.data = data;
    this.httpCode = 400;
  }

}

export class InvalidUserPasswordError extends BasicError {
  public constructor() {
    super();
    this.code = 'INVALID_USER_PASSWORD';
    this.message = 'Invalid user password';
    this.httpCode = 401;
  }

}

export class FileNotFoundError extends BasicError {
  public constructor(filename: string) {
    super();
    this.code = 'FILE_NOT_FOUND';
    this.message = 'File not found';
    this.httpCode = 500;
    this.data = { filename: filename };
  }

}

export class InvalidSessionError extends BasicError {
  public constructor(token: string) {
    super();
    this.code = 'INVALID_SESSION';
    this.message = 'The session is invalid';
    this.httpCode = 401;
    this.data = { token: token };
  }

}


// export class BlueError extends Error {
//   public name: string;
//   public id: string;
//   public message: string;
//   public data: any;
//   public stack: string;
//   public httpStatusCode: number;
//   constructor(message?: string) {
//     super(message);
//     this.id = cuid();
//     // we should set the prototype to our own class, because in ts 2.1 the compilation output changed,
//     // this should be done also in ALL SUBCLASSES
//     // details here:
//     // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work


//     Object.setPrototypeOf(this, BlueError.prototype);
//     this.message = message;
//     this.name = 'BlueError'; // name property is set like this to avoid minification issues.
//     if (typeof Error.captureStackTrace === 'function') {
//       Error.captureStackTrace(this, this.constructor);
//     } else {
//       this.stack = (<any>new Error(message)).stack;
//     }
//   }
//   public toJSON(): Object {
//     return serializeError(this);
//   }
// }

// export class FatalError extends BlueError {
//   public constructor(public message: string) {
//     super(message);
//     Object.setPrototypeOf(this, FatalError.prototype);
//     this.name = 'SystemError';
//     this.httpStatusCode = 500;
//   }
// }

// export class ConnectorError extends FatalError {
//   public constructor(public message: string, error: Error) {
//     super(message);
//     Object.setPrototypeOf(this, ConnectorError.prototype);
//     this.name = 'ConnectorError';
//     this.data = error;
//   }
// }

// export class ValidationError extends BlueError {
//   public constructor(public message: string, data?: any) {
//     super(message);
//     Object.setPrototypeOf(this, ValidationError.prototype);
//     this.name = 'ValidationError';
//     this.data = data;
//     this.httpStatusCode = 422;
//   }
// }

// export class PermissionError extends BlueError {
//   public constructor(public message: string) {
//     super(message);
//     Object.setPrototypeOf(this, PermissionError.prototype);
//     this.name = 'PermissionError';
//     this.httpStatusCode = 403;
//   }
// }

// export class UnauthorizedError extends BlueError {
//   public constructor(public message: string) {
//     super(message);
//     Object.setPrototypeOf(this, UnauthorizedError.prototype);
//     this.name = 'UnauthorizedError';
//     this.httpStatusCode = 401;
//   }
// }
