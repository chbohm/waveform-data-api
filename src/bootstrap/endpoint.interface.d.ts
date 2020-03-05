
declare namespace endpoint {
  type ExpressCallback = (request: IRequest, response: IResponse, next: INextFunction) => void;
  interface Endpoint {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'PROXY';
    path: string;
  }

  interface Definition {
    id: string;
    name?: string;
    endpoint: Endpoint;
    currentLevel?: 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly';
    callback: ExpressCallback;
  }



  interface IRequest extends express.Request { }

  interface IResponse extends express.Response { }

  interface INextFunction extends express.NextFunction { }

}
