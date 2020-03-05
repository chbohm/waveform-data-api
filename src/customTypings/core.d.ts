
declare namespace core {
  interface Dictionary<T> {
    [key: string]: T;
  }

  interface IContext {
    getStackTrace();

  }



interface ResponseParser {
  (req: endpoint.IResponse): any;
}




declare namespace requests {




}