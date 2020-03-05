
const ERROR_SYMBOL = Symbol('ErrorBase');
export abstract class ErrorBase {
  public statusCode: number;
  public message: string;
  public originalError: any;
  protected _context: core.IContext;

  public constructor(context: core.IContext, body?: any) {
    this._context = context;
    this.originalError = body;
  }

  static castTo<T extends ErrorBase>(classConstructor: new (...args: any[]) => T, contextError: ErrorBase, ...args: any[]): T {
    args.unshift(contextError._context);
    const err = new classConstructor(...args);
    err.originalError = contextError.originalError;
    return err;
  }


  public toJSON() {
    return {
      originalError: this.originalError,
      message: this.message,
      stack: this.stack(),
      errorType: this.getErrorType()
    };
  }
  private stack(): string {
    return this._context.getStackTrace();
  }
  private getErrorType(): string {
    return Object.getPrototypeOf(this).constructor.name;
  }
}


export function isProteusError(err: any): err is ErrorBase {
  return !!err && err[ERROR_SYMBOL] === true;
}

Object.defineProperty(ErrorBase.prototype, ERROR_SYMBOL, {
  value: true,
  configurable: false,
  enumerable: false,
  writable: false
});

