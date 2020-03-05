import * as express_ from 'express';
import * as request_ from 'request';

import { NextHandleFunction as NextHandleFunction_ } from 'connect';
import { OperatorFunction } from 'rxjs';

declare global {
  interface NextHandleFunction extends NextHandleFunction_ { }


  namespace express {
    interface Application extends express_.Application { }
    interface RequestParamHandler extends express_.RequestParamHandler { }
    interface Request extends express_.Request { }
    interface Response extends express_.Response, request_.Response {
      addListener: any;
      destroy: any;
      emit: any;
      on: any;
      once: any;
      prependListener: any;
      prependOnceListener: any;
      removeListener: any;
      setTimeout: any;
    }
    interface NextFunction extends express_.NextFunction { }
    interface RequestHandler extends express_.RequestHandler { }
  }


 
  type IMatcher = string | RegExp;



  interface IQuery extends request_.CoreOptions {
    path?: string;
    urlParams?: any;
  }


  interface ILoggerContext {
    toLogOrigin(): any;
    getStackTrace(): string;
  }

  interface IQueryWithUrl extends IQuery, request_.OptionsWithUri { }

}
